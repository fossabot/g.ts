/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {lab as colorLab} from 'd3-color';
import {interpolateColor} from './color';

export function interpolateLab(start, end) {
  const l = interpolateColor((start = colorLab(start)).l, (end = colorLab(end)).l),
        a       = interpolateColor(start.a, end.a),
        b       = interpolateColor(start.b, end.b),
        opacity = interpolateColor(start.opacity, end.opacity);
  return function(t) {
    start.l       = l(t);
    start.a       = a(t);
    start.b       = b(t);
    start.opacity = opacity(t);
    return start + '';
  };
}
