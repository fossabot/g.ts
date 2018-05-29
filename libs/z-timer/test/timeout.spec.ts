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

tape('timeout(callback) invokes the callback once', function(test) {
  let count = 0;
  timer.timeout(function() {
    test.equal(++count, 1);
    end(test);
  });
});

tape('timeout(callback, delay) invokes the callback once after the specified delay', function(test) {
  let then = timer.now(), delay = 50;
  timer.timeout(function(elapsed) {
    test.inRange(timer.now() - then, delay - 10, delay + 10);
    end(test);
  }, delay);
});

tape('timeout(callback, delay, time) invokes the callback once after the specified delay relative to the given time', function(test) {
  let then = timer.now() + 50, delay = 50;
  timer.timeout(function(elapsed) {
    test.inRange(timer.now() - then, delay - 10, delay + 10);
    end(test);
  }, delay, then);
});

tape('timeout(callback) uses the global context for the callback', function(test) {
  timer.timeout(function() {
    test.equal(this, global);
    end(test);
  });
});

tape('timeout(callback) passes the callback the elapsed time', function(test) {
  let then = timer.now(), count = 0;
  timer.timeout(function(elapsed) {
    test.equal(elapsed, timer.now() - then);
    end(test);
  });
});

tape('timeout(callback) returns a timer', function(test) {
  let count = 0;
  let t = timer.timeout(function() { ++count; });
  test.equal(t instanceof timer.timer, true);
  t.stop();
  setTimeout(function() {
    test.equal(count, 0);
    end(test);
  }, 100);
});
