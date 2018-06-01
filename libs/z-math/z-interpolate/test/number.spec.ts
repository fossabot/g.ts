/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

let tape = require('tape'),
    interpolate = require('../');

require('./inDelta');

tape('interpolateNumber(a, b) interpolates between two numbers a and b', function(test) {
  let i = interpolate.interpolateNumber(10, 42);
  test.inDelta(i(0.0), 10.0);
  test.inDelta(i(0.1), 13.2);
  test.inDelta(i(0.2), 16.4);
  test.inDelta(i(0.3), 19.6);
  test.inDelta(i(0.4), 22.8);
  test.inDelta(i(0.5), 26.0);
  test.inDelta(i(0.6), 29.2);
  test.inDelta(i(0.7), 32.4);
  test.inDelta(i(0.8), 35.6);
  test.inDelta(i(0.9), 38.8);
  test.inDelta(i(1.0), 42.0);
  test.end();
});
