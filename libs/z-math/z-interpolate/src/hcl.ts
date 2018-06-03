/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {hcl as colorHcl} from '@gradii/z-math/z-color';
import {interpolateColor, interpolateHue} from './color';

function hcl(hue) {
  return (start, end) => {
    let h = hue((start = colorHcl(start)).h, (end = colorHcl(end)).h),
        c       = interpolateColor(start.c, end.c),
        l       = interpolateColor(start.l, end.l),
        opacity = interpolateColor(start.opacity, end.opacity);
    return (t) => {
      start.h       = h(t);
      start.c       = c(t);
      start.l       = l(t);
      start.opacity = opacity(t);
      return start + '';
    };
  };
}

export const interpolateHcl     = hcl(interpolateHue);
export const interpolateHclLong = hcl(interpolateColor);
