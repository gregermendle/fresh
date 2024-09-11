const { serve } = require('./index')

serve((req) => {
  console.log(req.method, '::', req.url)
  return new Response("Hello", {
    headers: {
      'Content-type': "text/plain"
    },
    status: 200
  })
}, 8293)
  .then((port) => {
    console.log('Listening on ' + port)
  })
  .catch(console.error)
