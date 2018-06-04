/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

let frame     = 0, // is an animation frame pending?
    timeout   = 0, // is a timeout pending?
    interval  = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow  = 0,
    clockSkew = 0,
    clock     = typeof performance === 'object' && performance.now ? performance : Date,
    setFrame  = typeof window === 'object' && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function (f) { setTimeout(f, 17); };

export function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

export function timer(callback, delay, time) {
  let t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

export function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  let t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) { t._call.call(null, e); }
    t = t._next;
  }
  --frame;
}

export class Timer {
  private _call = null;
  private _time = null;
  private _next = null;

  restart(callback, delay, time) {
    if (typeof callback !== 'function') { throw new TypeError('callback is not a function'); }
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) { taskTail._next = this; }
      else { taskHead = this; }
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    this.sleep();
  }

  stop() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      this.sleep();
    }
  }

  private wake() {
    clockNow = (clockLast = clock.now()) + clockSkew;
    frame    = timeout = 0;
    try {
      timerFlush();
    } finally {
      frame = 0;
      this.nap();
      clockNow = 0;
    }
  }

  private poke() {
    let now = clock.now(), delay = now - clockLast;
    if (delay > pokeDelay) { clockSkew -= delay, clockLast = now; }
  }

  private nap() {
    let t0, t1 = taskHead, t2, time = Infinity;
    while (t1) {
      if (t1._call) {
        if (time > t1._time) { time = t1._time; }
        t0 = t1, t1 = t1._next;
      } else {
        t2 = t1._next, t1._next = null;
        t1 = t0 ? t0._next = t2 : taskHead = t2;
      }
    }
    taskTail = t0;
    this.sleep(time);
  }

  private sleep(time) {
    if (frame) { return; } // Soonest alarm already set, or will be.
    if (timeout) { timeout = clearTimeout(timeout); }
    let delay = time - clockNow; // Strictly less than if we recomputed clockNow.
    if (delay > 24) {
      if (time < Infinity) { timeout = setTimeout(this.wake.bind(this), time - clock.now() - clockSkew); }
      if (interval) { interval = clearInterval(interval); }
    } else {
      if (!interval) { clockLast = clock.now(), interval = setInterval(this.poke.bind(this), pokeDelay); }
      frame = 1, setFrame(this.wake);
    }
  }

}
