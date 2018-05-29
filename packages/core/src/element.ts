/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {d3Ease} from '@gradii/g/z-ease';

import {interpolate, interpolateArray} from '@gradii/g/z-interpolate'; // 目前整体动画只需要数值和数组的差值计算
import {d3Timer} from '@gradii/g/z-timer';

import MatrixUtil from '../../util/matrix';

import {PathUtil} from '../../util/path';
import {Format} from '../util/format';
import {Animate} from './animate';
import {Transform} from './transform';

const ReservedProps = {
  delay: 'delay',
};

const SHAPE_ATTRS = [
  'fillStyle',
  'font',
  'globalAlpha',
  'lineCap',
  'lineWidth',
  'lineJoin',
  'miterLimit',
  'shadowBlur',
  'shadowColor',
  'shadowOffsetX',
  'shadowOffsetY',
  'strokeStyle',
  'textAlign',
  'textBaseline',
  'lineDash',
  'lineDashOffset',
];

export class Element extends Transform {
  public static CFG = {
    /**
     * 唯一标示
     * @type {Number}
     */
    id       : null,
    /**
     * Z轴的层叠关系，Z值越大离用户越近
     * @type {Number}
     */
    zIndex   : 0,
    /**
     * Canvas对象
     * @type: {Object}
     */
    canvas   : null,
    /**
     * 父元素指针
     * @type {Object}
     */
    parent   : null,
    /**
     * 用来设置当前对象是否能被捕捉
     * true 能
     * false 不能
     * 对象默认是都可以被捕捉的, 当capture为false时，group.getShape(x, y)方法无法获得该元素
     * 通过将不必要捕捉的元素的该属性设置成false, 来提高捕捉性能
     * @type {Boolean}
     **/
    capture  : true,
    /**
     * 画布的上下文
     * @type {Object}
     */
    context  : null,
    /**
     * 是否显示
     * @type {Boolean}
     */
    visible  : true,
    /**
     * 是否被销毁
     * @type: {Boolean}
     */
    destroyed: false,
  };

  protected __cfg: any;

  constructor(cfg) {
    super();
    this.__cfg = {
      zIndex   : 0,
      capture  : true,
      visible  : true,
      destroyed: false,
    };
    // 配置存放地
    // Element.CFG不合并，提升性能 合并默认配置，用户配置->继承默认配置->Element默认配置
    this.__cfg = {...this.__cfg, ...this.getDefaultCfg(), ...cfg};
    this.initAttrs(this.__cfg.attrs); // 初始化绘图属性
    this.initTransform(); // 初始化变换
    this.init(); // 类型初始化
  }

  // region Element
  public init() {
    this.setSilent('animable', true);
    this.setSilent('animating', false); // 初始时不处于动画状态
    const attrs = this.__attrs;
    if (attrs && attrs.rotate) {
      this.rotateAtStart(attrs.rotate);
    }
  }

  public getParent() {
    return this.get('parent');
  }

  /**
   * 获取默认的配置信息
   * @protected
   * @return {Object} 默认的属性
   */
  public getDefaultCfg() {
    return {};
  }

  public set(name, value) {
    const m = '__set' + Util.upperFirst(name);

    if (this[m]) {
      value = this[m](value);
    }
    this.__cfg[name] = value;
    return this;
  }

  public setSilent(name, value) {
    this.__cfg[name] = value;
  }

  public get(name) {
    return this.__cfg[name];
  }

  public draw(context) {
    if (this.get('destroyed')) {
      return;
    }
    if (this.get('visible')) {
      this.setContext(context);
      this.drawInner(context);
      this.restoreContext(context);
    }
  }

  public setContext(context) {
    const clip = this.__attrs.clip;
    context.save();
    if (clip) {
      // context.save();
      clip.resetTransform(context);
      clip.createPath(context);
      context.clip();
      // context.restore();
    }
    this.resetContext(context);
    this.resetTransform(context);
  }

  public restoreContext(context) {
    context.restore();
  }

  public resetContext(context) {
    const elAttrs = this.__attrs;
    // var canvas = this.get('canvas');
    if (!this.isGroup) {
      // canvas.registShape(this); // 快速拾取方案暂时不执行
      for (const k in elAttrs) {
        if (SHAPE_ATTRS.indexOf(k) > -1) { // 非canvas属性不附加
          let v = elAttrs[k];
          if (k === 'fillStyle') {
            v = Format.parseStyle(v, this);
          }
          if (k === 'strokeStyle') {
            v = Format.parseStyle(v, this);
          }
          if (k === 'lineDash' && context.setLineDash) {
            if (Util.isArray(v)) {
              context.setLineDash(v);
            } else if (Util.isString(v)) {
              context.setLineDash(v.split(' '));
            }
          } else {
            context[k] = v;
          }
        }
      }
    }
  }

  public drawInner(/* context */) {

  }

  public show() {
    this.set('visible', true);
    return this;
  }

  public hide() {
    this.set('visible', false);
    return this;
  }

  public remove(destroy) {
    if (destroy === undefined) {
      destroy = true;
    }

    if (this.get('parent')) {
      const parent   = this.get('parent');
      const children = parent.get('children');
      Util.remove(children, this);
    }

    if (destroy) {
      this.destroy();
    }

    return this;
  }

  public destroy() {
    const destroyed = this.get('destroyed');
    if (destroyed) {
      return;
    }
    // 如果正在执行动画，清理动画
    if (this.get('animating')) {
      const timer = this.get('animateTimer');
      timer && timer.stop();
    }
    this.__cfg   = {};
    this.__attrs = null;
    this.removeEvent(); // 移除所有的事件
    this.set('destroyed', true);
  }

  public __setZIndex(zIndex) {
    this.__cfg.zIndex = zIndex;

    if (!Util.isNil(this.get('parent'))) {
      this.get('parent').sort();
    }
    return zIndex;
  }

  public __setAttrs(attrs) {
    this.attr(attrs);
    return attrs;
  }

  public setZIndex(zIndex) {
    this.__cfg.zIndex = zIndex;
    return zIndex;
  }

  public clone() {
    return Util.clone(this);
  }

  public getBBox() {
    return {
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0,
    };
  }

  // endregion

  // region Animate
  public stopAnimate() {
    const canvas = this.get('canvas');
    if (this.get('destroyed')) {
      return;
    }
    if (this.get('animating')) {
      const clip = this.attr('clip');
      // 如果 clip 在执行动画
      if (clip && clip.get('animating')) {
        clip.stopAnimate();
      }
      const timer = this.get('animateTimer');
      if (timer) {
        timer.stop();
        this.setSilent('animateTimer', null);
      }
      const animateCfg = this.get('animateCfg');
      if (animateCfg) {
        this.attr(animateCfg.toAttrs);
        if (animateCfg.toM) {
          this.setMatrix(animateCfg.toM);
        }
        if (animateCfg.callback) {
          animateCfg.callback();
        }
        this.setSilent('animateCfg', null);
      }
      this.setSilent('animating', false); // 动画停止
      canvas.draw();
    }
  }

  /**
   * 执行动画
   * @param  {Object}   toProps  动画最终状态
   * @param  {Number}   duration 动画执行时间
   * @param  {String}   easing   动画缓动效果
   * @param  {Function} callback 动画执行后的回调
   * @param  {Number}   delay    动画延迟时间
   */
  public animate(toProps, duration, easing, callback, delay = 0) {
    const canvas      = this.get('canvas');
    const formatProps = getFormatProps(toProps);
    const toAttrs     = formatProps.attrs;
    const toM         = formatProps.M;
    const fromAttrs   = getfromAttrs(toAttrs);
    const fromM       = Util.clone(this.getMatrix());
    const repeat      = toProps.repeat;
    let timer         = this.get('animateTimer');
    timer && timer.stop();
    // 可能不设置 easing
    if (Util.isNumber(callback)) {
      delay    = callback;
      callback = null;
    }
    if (Util.isFunction(easing)) {
      callback = easing;
      easing   = 'easeLinear';
    } else {
      easing = easing ? easing : 'easeLinear';
    }

    this.setSilent('animating', true); // 处于动画状态
    this.setSilent('animateCfg', {
      toAttrs,
      toM,
      callback,
    });

    // 执行动画
    timer = d3Timer.timer((elapsed) => {
      if (repeat) {
        excuteRepeat(elapsed);
      } else {
        excuteOnce(elapsed);
      }
    }, delay);

    this.setSilent('animateTimer', timer);

  }

  private excuteRepeat(elapsed) {
    let ratio = (elapsed % duration) / duration;
    ratio     = d3Ease[easing](ratio);
    update(ratio);
  }

  private excuteOnce(elapsed) {
    let ratio = elapsed / duration;
    if (ratio < 1) {
      ratio = d3Ease[easing](ratio);
      update(ratio);
    } else {
      update(1); // 保证最后一帧的绘制
      callback && callback();
      this.setSilent('animating', false); // 动画停止
      this.setSilent('animateCfg', null);
      this.setSilent('animateTimer', null);
      timer.stop();
    }
  }

  private update(ratio) {
    const cProps = {}; // 此刻属性
    if (this.get('destroyed')) {
      return;
    }
    let interf; //  差值函数

    for (const k in toAttrs) {
      if (!Util.isEqual(fromAttrs[k], toAttrs[k])) {
        if (k === 'path') {
          const toPath   = PathUtil.parsePathString(toAttrs[k]); // 终点状态
          const fromPath = PathUtil.parsePathString(fromAttrs[k]); // 起始状态
          cProps[k]      = [];
          for (let i = 0; i < toPath.length; i++) {
            const toPathPoint   = toPath[i];
            const fromPathPoint = fromPath[i];
            const cPathPoint    = [];
            for (let j = 0; j < toPathPoint.length; j++) {
              if (Util.isNumber(toPathPoint[j]) && fromPathPoint) {
                interf = interpolate(fromPathPoint[j], toPathPoint[j]);
                cPathPoint.push(interf(ratio));
              } else {
                cPathPoint.push(toPathPoint[j]);
              }
            }
            cProps[k].push(cPathPoint);
          }
        } else {
          interf    = interpolate(fromAttrs[k], toAttrs[k]);
          cProps[k] = interf(ratio);
        }
      }
    }
    if (toM) {
      const mf = interpolateArray(fromM, toM);
      const cM = mf(ratio);
      this.setMatrix(cM);
    }
    this.attr(cProps);
    canvas.draw();
  }

  private getFormatProps(props) {
    const rst = {
      M    : null,
      attrs: {},
    };
    for (const k in props) {
      if (k === 'transform') {
        rst.M = MatrixUtil.transform(this.getMatrix(), props[k]);
      } else if (k === 'matrix') {
        rst.M = props[k];
      } else if (!ReservedProps[k]) {
        rst.attrs[k] = props[k];
      }
    }
    return rst;
  }

  private getfromAttrs(toAttrs) {
    const rst = {};
    for (const k in toAttrs) {
      rst[k] = this.attr(k);
    }
    return rst;
  }

  // endregion
}
