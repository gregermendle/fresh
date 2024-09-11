import test from 'ava'

import { serve } from '../index'

test('sync function from native code', async (t) => {
  const fixture = 3000
  t.notThrowsAsync(serve(fixture));
})
