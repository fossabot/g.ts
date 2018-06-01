/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Shape} from '@gradii/g/core';

const Util     = require('../util/index');
const Inside   = require('./util/inside');
const Arrow    = require('./util/arrow');
const LineMath = require('./math/line');

export class Line extends Shape {
  public static ATTRS = {
    x1        : 0,
    y1        : 0,
    x2        : 0,
    y2        : 0,
    lineWidth : 1,
    startArrow: false,
    endArrow  : false,
  };

  protected canStroke = true;
  protected type      = 'line';

  public getDefaultAttrs() {
    return {
      lineWidth : 1,
      startArrow: false,
      endArrow  : false,
    };
  }

  public calculateBox() {
    const attrs            = this.__attrs;
    const {x1, y1, x2, y2} = attrs;
    const lineWidth        = this.getHitLineWidth();
    return LineMath.box(x1, y1, x2, y2, lineWidth);
  }

  public isPointInPath(x, y) {
    const attrs            = this.__attrs;
    const {x1, y1, x2, y2} = attrs;
    const lineWidth        = this.getHitLineWidth();

    if (this.hasStroke()) {
      return Inside.line(x1, y1, x2, y2, lineWidth, x, y);
    }

    return false;
  }

  public createPath(context) {
    const attrs = this.__attrs;
    const { x1, y1, x2, y2 } = attrs;
    context = context || self.get('context');
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
  }

  public afterPath(context) {
    const attrs = this.__attrs;
    const { x1, y1, x2, y2 } = attrs;
    context = context || this.get('context');
    if (attrs.startArrow) {
      Arrow.addStartArrow(context, attrs, x2, y2, x1, y1);
    }
    if (attrs.endArrow) {
      Arrow.addEndArrow(context, attrs, x1, y1, x2, y2);
    }
  }

  public getPoint(t) {
    const attrs = this.__attrs;
    return {
      x: LineMath.at(attrs.x1, attrs.x2, t),
      y: LineMath.at(attrs.y1, attrs.y2, t),
    };
  }
}
