/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Inside} from '@gradii/g/core';
import Util from '../util/index';
import {Element} from './element';

export class Shape extends Element {
  public static ATTRS = {};

  constructor(cfg) {
    super(cfg);
  }

  private isShape = true;

  public createPath(...args) {
  }
  
  public afterPath() {
  
  }

  public drawInner(context) {
    const attrs = this.__attrs;
    this.createPath(context);
    const originOpacity = context.globalAlpha;
    if (this.hasFill()) {
      const fillOpacity = attrs.fillOpacity;
      if (!Util.isNil(fillOpacity) && fillOpacity !== 1) {
        context.globalAlpha = fillOpacity;
        context.fill();
        context.globalAlpha = originOpacity;
      } else {
        context.fill();
      }
    }
    if (this.hasStroke()) {
      const lineWidth = this.__attrs.lineWidth;
      if (lineWidth > 0) {
        const strokeOpacity = attrs.strokeOpacity;
        if (!Util.isNil(strokeOpacity) && strokeOpacity !== 1) {
          context.globalAlpha = strokeOpacity;
        }
        context.stroke();
      }
    }
    this.afterPath(context);
  }

  /**
   * 节点是否在图形中
   * @param  {Number}  x x 坐标
   * @param  {Number}  y y 坐标
   * @return {Boolean}  是否在图形中
   */
  public isPointInPath(...args) {
    return false;
  }

  /**
   * 击中图形时是否进行包围盒判断
   * @return {Boolean} [description]
   */
  public isHitBox() {
    return true;
  }

  /**
   * 节点是否能够被击中
   * @param {Number} x x坐标
   * @param {Number} y y坐标
   * @return {Boolean} 是否在图形中
   */
  public isHit(x, y) {
    const self = this;
    const v    = [x, y, 1];
    this.invert(v); // canvas

    if (this.isHitBox()) {
      const box = this.getBBox();
      if (box && !Inside.box(box.minX, box.maxX, box.minY, box.maxY, v[0], v[1])) {
        return false;
      }
    }
    const clip = this.__attrs.clip;
    if (clip) {
      if (clip.inside(x, y)) {
        return this.isPointInPath(v[0], v[1]);
      }
    } else {
      return this.isPointInPath(v[0], v[1]);
    }
    return false;
  }

  /**
   * @protected
   * 计算包围盒
   * @return {Object} 包围盒
   */
  public calculateBox() {
    return null;
  }

  // 获取拾取时线的宽度，需要考虑附加的线的宽度
  public getHitLineWidth() {
    const attrs = this.__attrs;
    // if (!attrs.stroke) {
    //   return 0;
    // }
    const lineAppendWidth = attrs.lineAppendWidth || 0;
    const lineWidth       = attrs.lineWidth || 0;
    return lineWidth + lineAppendWidth;
  }

  // 清除当前的矩阵
  public clearTotalMatrix() {
    this.__cfg.totalMatrix = null;
    this.__cfg.region      = null;
  }

  public clearBBox() {
    this.__cfg.box    = null;
    this.__cfg.region = null;
  }

  public getBBox() {
    let box = this.__cfg.box;
    // 延迟计算
    if (!box) {
      box = this.calculateBox();
      if (box) {
        box.x      = box.minX;
        box.y      = box.minY;
        box.width  = box.maxX - box.minX;
        box.height = box.maxY - box.minY;
      }
      this.__cfg.box = box;
    }
    return box;
  }
}
