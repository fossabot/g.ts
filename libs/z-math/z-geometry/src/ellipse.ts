/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

export namespace ellipse {
  export function xAt(psi, rx, ry, cx, t) {
    return rx * Math.cos(psi) * Math.cos(t) - ry * Math.sin(psi) * Math.sin(t) + cx;
  }

  export function yAt(psi, rx, ry, cy, t) {
    return rx * Math.sin(psi) * Math.cos(t) + ry * Math.cos(psi) * Math.sin(t) + cy;
  }

  export function xExtrema(psi, rx, ry) {
    return Math.atan((-ry / rx) * Math.tan(psi));
  }

  export function yExtrema(psi, rx, ry) {
    return Math.atan((ry / (rx * Math.tan(psi))));
  }
}
