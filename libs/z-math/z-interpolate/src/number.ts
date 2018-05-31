/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

export function interpolateNumber(a, b) {
  return a = +a, b -= a, function(t) {
    return a + b * t;
  };
}
