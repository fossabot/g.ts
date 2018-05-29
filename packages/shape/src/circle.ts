/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Inside, Shape} from '@gradii/g/core';

export class Circle extends Shape {
  public static ATTRS = {
    x        : 0,
    y        : 0,
    r        : 0,
    lineWidth: 1,
  };

  protected __attrs: any;

  constructor(cfg) {
    super(cfg);
  }

  private canFill   = true;
  private canStroke = true;
  private type      = 'circle';

  public getDefaultAttrs() {
    return {
      lineWidth: 1,
    };
  }

  public calculateBox() {
    const attrs     = this.__attrs;
    const cx        = attrs.x;
    const cy        = attrs.y;
    const r         = attrs.r;
    const lineWidth = this.getHitLineWidth();
    const halfWidth = lineWidth / 2 + r;
    return {
      minX: cx - halfWidth,
      minY: cy - halfWidth,
      maxX: cx + halfWidth,
      maxY: cy + halfWidth,
    };
  }

  public isPointInPath(x, y) {
    const fill   = this.hasFill();
    const stroke = this.hasStroke();
    if (fill && stroke) {
      return this.__isPointInFill(x, y) || this.__isPointInStroke(x, y);
    }

    if (fill) {
      return this.__isPointInFill(x, y);
    }

    if (stroke) {
      return this.__isPointInStroke(x, y);
    }

    return false;
  }

  public __isPointInFill(x, y) {
    const attrs = this.__attrs;
    const cx    = attrs.x;
    const cy    = attrs.y;
    const r     = attrs.r;

    return Inside.circle(cx, cy, r, x, y);
  }

  public __isPointInStroke(x, y) {
    const attrs     = this.__attrs;
    const cx        = attrs.x;
    const cy        = attrs.y;
    const r         = attrs.r;
    const lineWidth = this.getHitLineWidth();

    return Inside.arcline(cx, cy, r, 0, Math.PI * 2, false, lineWidth, x, y);
  }

  public createPath(context) {
    const attrs = this.__attrs;
    const cx    = attrs.x;
    const cy    = attrs.y;
    const r     = attrs.r;
    context     = context || self.get('context');

    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2, false);
  }
}
