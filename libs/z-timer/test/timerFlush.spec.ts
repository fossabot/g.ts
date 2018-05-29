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

tape('timerFlush() immediately invokes any eligible timers', function(test) {
  let count = 0;
  let t = timer.timer(function() { ++count; t.stop(); });
  timer.timerFlush();
  timer.timerFlush();
  test.equal(count, 1);
  end(test);
});

tape('timerFlush() within timerFlush() still executes all eligible timers', function(test) {
  let count = 0;
  let t = timer.timer(function() { if (++count >= 3) { t.stop(); } timer.timerFlush(); });
  timer.timerFlush();
  test.equal(count, 3);
  end(test);
});

tape('timerFlush() observes the current time', function(test) {
  let start = timer.now(), foos = 0, bars = 0, bazs = 0;
  let foo = timer.timer(function() { ++foos; foo.stop(); }, 0, start + 1);
  let bar = timer.timer(function() { ++bars; bar.stop(); }, 0, start);
  let baz = timer.timer(function() { ++bazs; baz.stop(); }, 0, start - 1);
  timer.timerFlush();
  test.equal(foos, 0);
  test.equal(bars, 1);
  test.equal(bazs, 1);
  end(test);
});
