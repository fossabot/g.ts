/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Event, Group} from '@gradii/g/core';
import {createDom, getRatio, isEmpty, modifyCSS, requestAnimationFrame, uniqueId} from '@gradii/g/util';

export class Canvas extends Group {
  public static CFG = {
    eventEnable : true,
    /**
     * 像素宽度
     * @type {Number}
     */
    width       : null,
    /**
     * 像素高度
     * @type {Number}
     */
    height      : null,
    /**
     * 画布宽度
     * @type {Number}
     */
    widthCanvas : null,
    /**
     * 画布高度
     * @type {Number}
     */
    heightCanvas: null,
    /**
     * CSS宽
     * @type {String}
     */
    widthStyle  : null,
    /**
     * CSS高
     * @type {String}
     */
    heightStyle : null,
    /**
     * 容器DOM
     * @type {Object}
     */
    containerDOM: null,
    /**
     * 当前Canvas的DOM
     * @type {Object}
     */
    canvasDOM   : null,
    /**
     * 屏幕像素比
     * @type {Number}
     */
    pixelRatio  : null,
  };

  constructor(cfg) {
    super(cfg);
  }

  public init() {
    super.init();
    this._setGlobalParam();
    this._setDOM();
    this._setInitSize();
    this._setCanvas();
    this._scale();
    if (this.get('eventEnable')) {
      this._registEvents();
    }
  }

  public getEmitter(element, event) {
    if (element) {
      if (isEmpty(element._getEvents())) {
        const parent = element.get('parent');
        if (parent && !event.propagationStopped) {
          return this.getEmitter(parent, event);
        }
      } else {
        return element;
      }
    }
  }

  public _getEventObj(type, e, point, target) {
    const event         = new Event(type, e, true, true);
    event.x             = point.x;
    event.y             = point.y;
    event.clientX       = e.clientX;
    event.clientY       = e.clientY;
    event.currentTarget = target;
    event.target        = target;
    return event;
  }

  public _triggerEvent(type, e) {
    const point = this.getPointByClient(e.clientX, e.clientY);
    const shape = this.getShape(point.x, point.y);
    let emitObj;
    if (type === 'mousemove') {
      const canvasmousemove = this._getEventObj('mousemove', e, point, this);
      this.emit('mousemove', canvasmousemove);

      const preShape = this.get('preShape');
      if (preShape && preShape !== shape) {
        const mouseleave = this._getEventObj('mouseleave', e, point, preShape);
        emitObj          = this.getEmitter(preShape, e);
        emitObj && emitObj.emit('mouseleave', mouseleave);
      }

      if (shape) {
        const mousemove = this._getEventObj('mousemove', e, point, shape);
        emitObj         = this.getEmitter(shape, e);
        emitObj && emitObj.emit('mousemove', mousemove);

        if (preShape !== shape) {
          const mouseenter = this._getEventObj('mouseenter', e, point, shape);
          emitObj && emitObj.emit('mouseenter', mouseenter, e);
        }
      }

      this.set('preShape', shape);
    } else {
      const event = this._getEventObj(type, e, point, shape || this);
      emitObj     = this.getEmitter(shape, e);
      if (emitObj && emitObj !== this) {
        emitObj.emit(type, event);
      }
      this.emit(type, event);
    }

    const el = this.get('el');
    if (shape && !shape.get('destroyed')) {
      el.style.cursor = shape.attr('cursor') || 'default';
    }
  }

  public _registEvents() {
    const el = this.get('el');

    el.addEventListener('mouseout', (e) => {
      this._triggerEvent('mouseleave', e);
    }, false);

    el.addEventListener('mouseover', (e) => {
      this._triggerEvent('mouseenter', e);
    }, false);

    el.addEventListener('mousemove', (e) => {
      this._triggerEvent('mousemove', e);
    }, false);

    el.addEventListener('mousedown', (e) => {
      this._triggerEvent('mousedown', e);
    }, false);

    el.addEventListener('mouseup', (e) => {
      this._triggerEvent('mouseup', e);
    }, false);

    el.addEventListener('click', (e) => {
      this._triggerEvent('click', e);
    }, false);

    el.addEventListener('dblclick', (e) => {
      this._triggerEvent('dblclick', e);
    }, false);

    el.addEventListener('touchstart', (e) => {
      if (!isEmpty(e.touches)) {
        this._triggerEvent('touchstart', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchmove', (e) => {
      if (!isEmpty(e.touches)) {
        this._triggerEvent('touchmove', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchend', (e) => {
      if (!isEmpty(e.changedTouches)) {
        this._triggerEvent('touchend', e.changedTouches[0]);
      }
    }, false);
  }

  public _scale() {
    const pixelRatio = this.get('pixelRatio');
    this.scale(pixelRatio, pixelRatio);
  }

  public _setCanvas() {
    const canvasDOM = this.get('canvasDOM');
    this.set('el', canvasDOM);
    this.set('context', canvasDOM.getContext('2d'));
    this.set('canvas', this);
  }

  public _setGlobalParam() {
    const pixelRatio = this.get('pixelRatio');
    if (!pixelRatio) {
      this.set('pixelRatio', getRatio());
    }
    return;
  }

  public _setDOM() {
    this._setContainer();
    this._setLayer();
  }

  public _setContainer() {
    const containerId = this.get('containerId');
    let containerDOM  = this.get('containerDOM');
    if (!containerDOM) {
      containerDOM = document.getElementById(containerId);
      this.set('containerDOM', containerDOM);
    }
    modifyCSS(containerDOM, {
      position: 'relative',
    });
  }

  public _setLayer() {
    const containerDOM = this.get('containerDOM');
    const canvasId     = uniqueId('canvas_');
    if (containerDOM) {
      const canvasDOM = createDom('<canvas id="' + canvasId + '"></canvas>');
      containerDOM.appendChild(canvasDOM);
      this.set('canvasDOM', canvasDOM);
    }
  }

  public _setInitSize() {
    this.changeSize(this.get('width'), this.get('height'));
  }

  public _reSize() {
    const canvasDOM    = this.get('canvasDOM');
    const widthCanvas  = this.get('widthCanvas');
    const heightCanvas = this.get('heightCanvas');
    const widthStyle   = this.get('widthStyle');
    const heightStyle  = this.get('heightStyle');

    canvasDOM.style.width  = widthStyle;
    canvasDOM.style.height = heightStyle;
    canvasDOM.setAttribute('width', widthCanvas);
    canvasDOM.setAttribute('height', heightCanvas);
  }

  public getWidth() {
    const pixelRatio = this.get('pixelRatio');
    const width      = this.get('width');
    return width * pixelRatio;
  }

  public getHeight() {
    const pixelRatio = this.get('pixelRatio');
    const height     = this.get('height');
    return height * pixelRatio;
  }

  public changeSize(width, height) {
    const pixelRatio   = this.get('pixelRatio');
    const widthCanvas  = width * pixelRatio;
    const heightCanvas = height * pixelRatio;

    this.set('widthCanvas', widthCanvas);
    this.set('heightCanvas', heightCanvas);
    this.set('widthStyle', width + 'px');
    this.set('heightStyle', height + 'px');
    this.set('width', width);
    this.set('height', height);
    this._reSize();
  }

  /**
   * 将窗口坐标转变成 canvas 坐标
   * @param  {Number} clientX 窗口x坐标
   * @param  {Number} clientY 窗口y坐标
   * @return {Object} canvas坐标
   */
  public getPointByClient(clientX, clientY) {
    const el     = this.get('el');
    const bbox   = el.getBoundingClientRect();
    const width  = bbox.right - bbox.left;
    const height = bbox.bottom - bbox.top;
    return {
      x: (clientX - bbox.left) * (el.width / width),
      y: (clientY - bbox.top) * (el.height / height),
    };
  }

  public getClientByPoint(x, y) {
    const el     = this.get('el');
    const bbox   = el.getBoundingClientRect();
    const width  = bbox.right - bbox.left;
    const height = bbox.bottom - bbox.top;
    return {
      clientX: x / (el.width / width) + bbox.left,
      clientY: y / (el.height / height) + bbox.top,
    };
  }

  public beforeDraw() {
    const context = this.get('context');
    const el      = this.get('el');
    context && context.clearRect(0, 0, el.width, el.height);
  }

  public _beginDraw() {
    this.setSilent('toDraw', true);
  }

  public _endDraw() {
    this.setSilent('toDraw', false);
  }

  public draw() {
    function drawInner() {
      this.setSilent('animateHandler', requestAnimationFrame(() => {
        this.setSilent('animateHandler', undefined);
        if (this.get('toDraw')) {
          drawInner();
        }
      }));
      this.beforeDraw();
      try {
        const context = this.get('context');
        super.draw(context);
        // this._drawCanvas();
      } catch (ev) { // 绘制时异常，中断重绘
        console.warn('error in draw canvas, detail as:');
        console.warn(ev);
        this._endDraw();
      }
      this._endDraw();
    }

    if (this.get('destroyed')) {
      return;
    }
    if (this.get('animateHandler')) {
      this._beginDraw();
    } else {
      drawInner();
    }
  }

  public destroy() {
    const containerDOM = this.get('containerDOM');
    const canvasDOM    = this.get('canvasDOM');
    if (canvasDOM && containerDOM) {
      containerDOM.removeChild(canvasDOM);
    }
    super.destroy();
  }

}
