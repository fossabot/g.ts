/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

// const Util = require('./util/index');

/**
 * Event
 */
export class Event {
  public x;
  public y;
  public clientX;
  public clientY;

  public target             = null; // 目标
  public currentTarget      = null; // 当前目标
  public timeStamp          = (new Date()).getTime(); // 时间戳
  public defaultPrevented   = false; // 阻止默认
  public propagationStopped = false; // 阻止冒泡
  public removed            = false; // 是否被移除

  /**
   * @param type 事件类型
   * @param event 触发的原生事件
   * @param bubbles 冒泡
   * @param cancelable 是否能够阻止
   */
  constructor(public type,
              public event,
              public bubbles,
              public cancelable) {

  }

  public preventDefault() {
    this.defaultPrevented = this.cancelable && true;
  }

  public stopPropagation() {
    this.propagationStopped = true;
  }

  public remove() {
    this.removed = true;
  }

  // clone() {
  //   return Util.clone(this);
  //   return new Event(this.type, this.event, this.bubbles, this.cancelable);
  // }

  public toString() {
    return '[Event (type=' + this.type + ')]';
  }
}
