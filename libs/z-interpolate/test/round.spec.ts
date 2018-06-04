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

tape('interpolateRound(a, b) interpolates between two numbers a and b, and then rounds', function(test) {
  let i = interpolate.interpolateRound(10, 42);
  test.equal(i(0.0), 10);
  test.equal(i(0.1), 13);
  test.equal(i(0.2), 16);
  test.equal(i(0.3), 20);
  test.equal(i(0.4), 23);
  test.equal(i(0.5), 26);
  test.equal(i(0.6), 29);
  test.equal(i(0.7), 32);
  test.equal(i(0.8), 36);
  test.equal(i(0.9), 39);
  test.equal(i(1.0), 42);
  test.end();
});

tape('interpolateRound(a, b) does not pre-round a and b', function(test) {
  let i = interpolate.interpolateRound(2.6, 3.6);
  test.equal(i(0.6), 3);
  test.end();
});
