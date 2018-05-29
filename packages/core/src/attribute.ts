/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {EventEmitter} from '@gradii/g/event-emitter';
import {isObject} from 'util';

const ALIAS_ATTRS           = ['strokeStyle', 'fillStyle', 'globalAlpha'];
const CLIP_SHAPES           = ['circle', 'ellipse', 'fan', 'polygon', 'rect', 'path'];
const CAPITALIZED_ATTRS_MAP = {
  r            : 'R',
  opacity      : 'Opacity',
  lineWidth    : 'LineWidth',
  clip         : 'Clip',
  stroke       : 'Stroke',
  fill         : 'Fill',
  strokeOpacity: 'Stroke',
  fillOpacity  : 'Fill',
  x            : 'X',
  y            : 'Y',
  rx           : 'Rx',
  ry           : 'Ry',
  re           : 'Re',
  rs           : 'Rs',
  width        : 'Width',
  height       : 'Height',
  img          : 'Img',
  x1           : 'X1',
  x2           : 'X2',
  y1           : 'Y1',
  y2           : 'Y2',
  points       : 'Points',
  p1           : 'P1',
  p2           : 'P2',
  p3           : 'P3',
  p4           : 'P4',
  text         : 'Text',
  radius       : 'Radius',
  textAlign    : 'TextAlign',
  textBaseline : 'TextBaseline',
  font         : 'Font',
  fontSize     : 'FontSize',
  fontStyle    : 'FontStyle',
  fontVariant  : 'FontVariant',
  fontWeight   : 'FontWeight',
  fontFamily   : 'FontFamily',
  clockwise    : 'Clockwise',
  startAngle   : 'StartAngle',
  endAngle     : 'EndAngle',
  path         : 'Path',
};
const ALIAS_ATTRS_MAP       = {
  stroke : 'strokeStyle',
  fill   : 'fillStyle',
  opacity: 'globalAlpha',
};

export class Attribute extends EventEmitter {
  public canFill   = false;
  public canStroke = false;

  protected __attrs;

  public initAttrs(attrs) {
    this.__attrs = {
      opacity      : 1,
      fillOpacity  : 1,
      strokeOpacity: 1,
    };
    this.attr({...this.getDefaultAttrs(), ...attrs});
    return this;
  }

  public getDefaultAttrs() {
    return {};
  }

  /**
   * 设置或者设置属性，有以下 4 种情形：
   *   - name 不存在, 则返回属性集合
   *   - name 为字符串，value 为空，获取属性值
   *   - name 为字符串，value 不为空，设置属性值，返回 this
   *   - name 为键值对，value 为空，设置属性值
   *
   * @param  {String | Object} name  属性名
   * @param  {*} value 属性值
   * @return {*} 属性值
   */
  public attr(name, value?) {
    if (arguments.length === 0) {
      return this.__attrs;
    }

    if (isObject(name)) {
      for (const k in name) {
        if (ALIAS_ATTRS.indexOf(k) === -1) {
          const v = name[k];
          this._setAttr(k, v);
        }
      }
      if (this.__afterSetAttrAll) {
        this.__afterSetAttrAll(name);
      }
      // this.setSilent('box', null);
      this.clearBBox();
      return self;
    }
    if (arguments.length === 2) {
      if (this._setAttr(name, value) !== false) {
        const m = '__afterSetAttr' + CAPITALIZED_ATTRS_MAP[name];
        if (self[m]) {
          self[m](value);
        }
      }
      // this.setSilent('box', null);
      this.clearBBox();
      return self;
    }
    return this._getAttr(name);
  }

  public clearBBox() {
    this.setSilent('box', null);
  }

  public __afterSetAttrAll(...args) {

  }

  // 属性获取触发函数
  public _getAttr(name) {
    return this.__attrs[name];
  }

  // 属性设置触发函数
  public _setAttr(name, value): this {
    if (name === 'clip') {
      this.__setAttrClip(value);
      this.__attrs.clip = value;
    } else if (name === 'transform') {
      this.__setAttrTrans(value);
    } else {
      this.__attrs[name] = value;
      const alias        = ALIAS_ATTRS_MAP[name];
      if (alias) {
        this.__attrs[alias] = value;
      }
    }
    return this;
  }

  public hasFill() {
    return this.canFill && this.__attrs.fillStyle;
  }

  public hasStroke() {
    return this.canStroke && this.__attrs.strokeStyle;
  }

  // 设置透明度
  public __setAttrOpacity(v) {
    this.__attrs.globalAlpha = v;
    return v;
  }

  public __setAttrClip(clip) {
    const self = this;
    if (clip && (CLIP_SHAPES.indexOf(clip.type) > -1)) {
      if (clip.get('canvas') === null) {
        clip = Util.clone(clip);
      }
      clip.set('parent', this.get('parent'));
      clip.set('context', this.get('context'));
      clip.inside = function(x, y) {
        const v = [x, y, 1];
        clip.invert(v, this.get('canvas')); // 已经在外面转换
        return clip.__isPointInFill(v[0], v[1]);
      };
      return clip;
    }
    return null;
  }

  public __setAttrTrans(value) {
    return this.transform(value);
  }
}
