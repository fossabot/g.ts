/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

// Some tests need a trailing frame after timers are stopped to cleanup the
// queue and clear the alarm. Let that finish before starting a new test.
module.exports = function(test) {
  setTimeout(function() {
    test.end();
  }, 24);
};
