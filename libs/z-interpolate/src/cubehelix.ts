/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {ColorCubehelix} from '@gradii/g/z-color';
import {interpolateColor, interpolateHue} from './color';

export class Cubehelix {

  constructor(private hue, private gamma = 1) {
  }

  public interpolate(start, end) {
    const h = this.hue((start = ColorCubehelix.create(start)).h, (end = ColorCubehelix.create(end)).h),
          s       = interpolateColor(start.s, end.s),
          l       = interpolateColor(start.l, end.l),
          opacity = interpolateColor(start.opacity, end.opacity);
    return function(t) {
      start.h       = h(t);
      start.s       = s(t);
      start.l       = l(Math.pow(t, this.gamma));
      start.opacity = opacity(t);
      return start + '';
    };
  }

  public static create(hue, gamma = 1) {
    return new Cubehelix(hue, gamma);
  }
}

export const interpolateCubehelix   = Cubehelix.create(interpolateHue).interpolate;
export let interpolateCubehelixLong = Cubehelix.create(interpolateColor);
