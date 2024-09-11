#![deny(clippy::all)]

use napi::{bindgen_prelude::*, CallContext, JsObject};
use napi_derive::{js_function, module_exports, napi};
use std::net::SocketAddr;

use http_body_util::Full;
use hyper::body::{Bytes, Incoming};
use hyper::server::conn::http1;
use hyper::service::service_fn;
use hyper::{header, Request, Response, StatusCode, Uri};
use hyper_util::rt::TokioIo;
use tokio::net::TcpListener;

#[module_exports]
fn init(mut exports: JsObject) -> Result<()> {
  exports.create_named_method("serve", serve)?;
  Ok(())
}

#[js_function(3)]
pub fn serve(ctx: CallContext) -> Result<()> {
  let handle_cb = ctx.get::<JsFunction>(0)?;
  let port = ctx.get::<u16>(1)?;
  let ready_cb = ctx.get::<JsFunction>(2)?;

  let ready_tsfn_callback = ctx.env.create_threadsafe_function(
    &ready_cb,
    1,
    move |_: napi::threadsafe_function::ThreadSafeCallContext<Option<u32>>| Ok(vec![port]),
  )?;

  let handle_tsfn_callback = ctx.env.create_threadsafe_function(
    &handle_cb,
    0,
    move |cx: napi::threadsafe_function::ThreadSafeCallContext<Request<Incoming>>| {
      let req: FreshRequest = cx.value.into();
      println!("{:?} :: {:?}", req.method, req.url);
      Ok(vec![req])
    },
  )?;

  let listen = async move {
    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = TcpListener::bind(addr).await?;

    ready_tsfn_callback.call(
      Ok(None),
      napi::threadsafe_function::ThreadsafeFunctionCallMode::Blocking,
    );

    loop {
      let (stream, _) = listener.accept().await.unwrap();
      let io = TokioIo::new(stream);
      let handle_tsfn_callback = handle_tsfn_callback.clone();

      tokio::task::spawn(async move {
        http1::Builder::new()
          .serve_connection(
            io,
            service_fn(|req: Request<hyper::body::Incoming>| async {
              match handle_tsfn_callback.call_async(Ok(req)).await as Result<Promise<FreshResponse>> {
                Ok(res) => match res.await {
                  Ok(res) => Ok(Response::from(res)) as Result<Response<Full<Bytes>>>,
                  Err(err) => {
                    println!("{:?}", err);
                    internal_server_error()
                  }
                },
                Err(err) => {
                  println!("{:?}", err);
                  internal_server_error()
                }
              }
            }),
          )
          .await
      });
    }

    #[allow(unreachable_code)]
    Ok(())
  };

  let _ = ctx
    .env
    .execute_tokio_future(listen, |env, _| env.get_undefined());

  Ok(())
}

fn internal_server_error() -> Result<Response<Full<Bytes>>> {
  Ok(
    Response::builder()
      .status(500)
      .body(Full::new(Bytes::from("Internal Server Error")))
      .unwrap(),
  )
}

#[napi(object)]
#[derive(Debug)]
pub struct FreshResponse {
  pub status: u16,
  pub headers: Vec<Vec<String>>,
  pub body: Vec<u8>,
}

#[napi(object)]
#[derive(Debug)]
pub struct FreshRequest {
  pub url: String,
  pub method: String,
  pub headers: Vec<FreshHeader>,
}

#[napi(object)]
#[derive(Debug)]
pub struct FreshHeader {
  pub key: String,
  pub value: Vec<u8>,
}

impl From<FreshResponse> for Response<Full<Bytes>> {
  fn from(res: FreshResponse) -> Response<Full<Bytes>> {
    let status = StatusCode::from_u16(res.status).unwrap_or(StatusCode::OK);
    let mut builder = Response::builder().status(status);

    for headers in res.headers {
      builder = builder.header(headers[0].to_string(), headers[1].to_string());
    }

    builder.body(Full::from(res.body)).unwrap()
  }
}

impl From<Request<Incoming>> for FreshRequest {
  fn from(req: Request<Incoming>) -> FreshRequest {
    let host = if let Some(host) = req.headers().get(header::HOST) {
      host.to_str().unwrap_or("localhost")
    } else {
      "localhost"
    };

    let url = if let Ok(url) = Uri::builder()
      .authority(host)
      .scheme("http")
      .path_and_query(req.uri().path_and_query().unwrap().to_string())
      .build()
    {
      url.to_string()
    } else {
      Uri::default().to_string()
    };

    FreshRequest {
      url,
      method: req.method().to_string(),
      headers: req
        .headers()
        .iter()
        .map(|(k, v)| FreshHeader {
          key: k.to_string(),
          value: v.as_bytes().to_vec(),
        })
        .collect(),
    }
  }
}
