/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Color, hex} from './color';
import {brighter, darker} from './const';

export class Rgb {
  constructor(public r?, public g?, public b?, public opacity = 1) {
  }

  public static rgbn(n) {
    return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
  }

  public static rgba(r, g, b, a) {
    if (a <= 0) { r = g = b = NaN; }
    return new Rgb(r, g, b, a);
  }

  public brighter(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  }

  public darker(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
  }

  public rgb() {
    return this;
  }

  public displayable() {
    return (0 <= this.r && this.r <= 255)
      && (0 <= this.g && this.g <= 255)
      && (0 <= this.b && this.b <= 255)
      && (0 <= this.opacity && this.opacity <= 1);
  }

  public hex() {
    return '#' + hex(this.r) + hex(this.g) + hex(this.b);
  }

  public toString() {
    let a = this.opacity;
    a     = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
    return (a === 1 ? 'rgb(' : 'rgba(')
      + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ', '
      + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ', '
      + Math.max(0, Math.min(255, Math.round(this.b) || 0))
      + (a === 1 ? ')' : ', ' + a + ')');
  }
  
  public static create(o) {
    if (!(o instanceof Color)) { o = Color.create(o); }
    if (!o) { return new Rgb; }
    o = o.rgb();
    return new Rgb(o.r, o.g, o.b, o.opacity);
  }
}
