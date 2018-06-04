/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {rgb as colorRgb} from 'd3-color';
import {interpolateBasis} from './basis';
import {interpolateBasisClosed} from './basisClosed';
import {gamma, noGamma} from './color';

export class RgbGamma {
  private color;

  constructor(private _gamma = 1) {
    this.color = gamma(_gamma);
  }

  public interpolate(start, end) {
    const r = this.color((start = colorRgb(start)).r, (end = colorRgb(end)).r),
          g       = this.color(start.g, end.g),
          b       = this.color(start.b, end.b),
          opacity = noGamma(start.opacity, end.opacity);
    return function(t) {
      start.r       = r(t);
      start.g       = g(t);
      start.b       = b(t);
      start.opacity = opacity(t);
      return start + '';
    };
  }

  public static create(gamma) {
    return new RgbGamma(gamma);
  }
}

export class RgbSpline {

  constructor(private spline) {
    this.spline = spline;
  }

  public interpolate(colors) {
    const n = colors.length;
    let r   = new Array(n),
          g = new Array(n),
          b = new Array(n),
          i, color;
    for (i = 0; i < n; ++i) {
      color = colorRgb(colors[i]);
      r[i]  = color.r || 0;
      g[i]  = color.g || 0;
      b[i]  = color.b || 0;
    }
    const sR      = this.spline(r);
    const sG      = this.spline(g);
    const sB      = this.spline(b);
    color.opacity = 1;
    return function(t) {
      color.r = sR(t);
      color.g = sG(t);
      color.b = sB(t);
      return color + '';
    };
  }

  public static create(spline) {
    return new RgbSpline(spline);
  }
}

export const interpolateRgb            = RgbGamma.create(1).interpolate;
export const interpolateRgbBasis       = RgbSpline.create(interpolateBasis).interpolate;
export const interpolateRgbBasisClosed = RgbSpline.create(interpolateBasisClosed).interpolate;
