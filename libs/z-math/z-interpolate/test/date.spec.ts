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

tape('interpolateDate(a, b) interpolates between two dates a and b', function(test) {
  let i = interpolate.interpolateDate(new Date(2000, 0, 1), new Date(2000, 0, 2));
  test.equal(i(0.0) instanceof Date, true);
  test.equal(i(0.5) instanceof Date, true);
  test.equal(i(1.0) instanceof Date, true);
  test.strictEqual(+i(0.2), +new Date(2000, 0, 1, 4, 48));
  test.strictEqual(+i(0.4), +new Date(2000, 0, 1, 9, 36));
  test.end();
});

tape('interpolateDate(a, b) reuses the output datea', function(test) {
  let i = interpolate.interpolateDate(new Date(2000, 0, 1), new Date(2000, 0, 2));
  test.strictEqual(i(0.2), i(0.4));
  test.end();
});
