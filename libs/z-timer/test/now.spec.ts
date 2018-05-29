/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

let tape = require('tape'),
    timer = require('../'),
    end = require('./end');

require('./inRange');

tape('now() returns the same time when called repeatedly', function(test) {
  let now = timer.now();
  test.ok(now > 0);
  test.equal(timer.now(), now);
  end(test);
});

tape('now() returns a different time when called after a timeout', function(test) {
  let then = timer.now();
  test.ok(then > 0);
  setTimeout(function() {
    test.inRange(timer.now() - then, 50 - 5, 50 + 5);
    end(test);
  }, 50);
});
