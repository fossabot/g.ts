/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {hsl as colorHsl} from 'd3-color';
import {interpolateColor, interpolateHue} from './color';

function hsl(hue) {
  return function(start, end) {
    const h = hue((start = colorHsl(start)).h, (end = colorHsl(end)).h),
          s       = interpolateColor(start.s, end.s),
          l       = interpolateColor(start.l, end.l),
          opacity = interpolateColor(start.opacity, end.opacity);
    return function(t) {
      start.h       = h(t);
      start.s       = s(t);
      start.l       = l(t);
      start.opacity = opacity(t);
      return start + '';
    };
  };
}

export const interpolateHsl     = hsl(interpolateHue);
export const interpolateHslLong = hsl(interpolateColor);
