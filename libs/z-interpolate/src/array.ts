/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {interpolateValue} from './value';

export function interpolateArray(a, b) {
  let nb = b ? b.length : 0,
      na = a ? Math.min(nb, a.length) : 0,
      x  = new Array(na),
      c  = new Array(nb),
      i;

  for (i = 0; i < na; ++i) {
    x[i] = interpolateValue(a[i], b[i]);
  }
  for (; i < nb; ++i) {
    c[i] = b[i];
  }

  return (t) => {
    for (i = 0; i < na; ++i) {
      c[i] = x[i](t);
    }
    return c;
  };
}
