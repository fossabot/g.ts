/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Shape} from '../core/shape';
import Util from '../util/index';
import {Inside} from './util/inside';

export class Marker extends Shape {
  public static Symbols = {
    // 圆
    'circle'(x, y, r, ctx) {
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
    },
    // 正方形
    'square'(x, y, r, ctx) {
      ctx.moveTo(x - r, y - r);
      ctx.lineTo(x + r, y - r);
      ctx.lineTo(x + r, y + r);
      ctx.lineTo(x - r, y + r);
      ctx.closePath();
    },
    // 菱形
    'diamond'(x, y, r, ctx) {
      ctx.moveTo(x - r, y);
      ctx.lineTo(x, y - r);
      ctx.lineTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.closePath();
    },
    // 三角形
    'triangle'(x, y, r, ctx) {
      const diffY = r * Math.sin((1 / 3) * Math.PI);
      ctx.moveTo(x - r, y + diffY);
      ctx.lineTo(x, y - diffY);
      ctx.lineTo(x + r, y + diffY);
      ctx.closePath();
    },
    // 倒三角形
    'triangle-down'(x, y, r, ctx) {
      const diffY = r * Math.sin((1 / 3) * Math.PI);
      ctx.moveTo(x - r, y - diffY);
      ctx.lineTo(x + r, y - diffY);
      ctx.lineTo(x, y + diffY);
      ctx.closePath();
    },
  };

  public static ATTRS = {
    path     : null,
    lineWidth: 1,
  };

  public readonly type      = 'marker';
  public readonly canFill   = true;
  public readonly canStroke = true;

  constructor(cfg) {
    super(cfg);
  }

  public getDefaultAttrs() {
    return {
      x        : 0,
      y        : 0,
      lineWidth: 1,
    };
  }

  public calculateBox() {
    const attrs     = this.__attrs;
    const cx        = attrs.x;
    const cy        = attrs.y;
    const r         = attrs.radius;
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
    const attrs     = this.__attrs;
    const cx        = attrs.x;
    const cy        = attrs.y;
    const r         = attrs.radius;
    const lineWidth = this.getHitLineWidth();
    return Inside.circle(cx, cy, r + lineWidth / 2, x, y);
  }

  public createPath(context) {
    const attrs  = this.__attrs;
    const x      = attrs.x;
    const y      = attrs.y;
    const r      = attrs.radius;
    const symbol = attrs.symbol || 'circle';
    let method;
    if (Util.isFunction(symbol)) {
      method = symbol;
    } else {
      method = Marker.Symbols[symbol];
    }
    context.beginPath();
    method(x, y, r, context, this);
  }

}
