/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const Tau       = 2 * Math.PI,
      Amplitude = 1,
      Period    = 0.3;

export class ElasticIn {
  private _p3: number;

  constructor(protected amplitude: number = Amplitude, protected period: number = Period) {
    this._p3 = Math.asin(1 / (amplitude = Math.max(1, amplitude))) * (period /= Tau);
  }

  public getRatio(p: number): number {
    return -(this.amplitude * Math.pow(2, 10 * (p -= 1)) * Math.sin((p - this._p3) * Tau / this.period));
  }

  public static create(amplitude: number, period: number): ElasticIn {
    return new ElasticIn(amplitude, period);
  }
}

export class ElasticOut {
  private _p3: number;

  constructor(protected amplitude: number = Amplitude, protected period: number = Period) {
    this._p3 = Math.asin(1 / (amplitude = Math.max(1, amplitude))) * (period /= Tau);
  }

  public getRatio(p: number): number {
    return this.amplitude * Math.pow(2, 10 * p) * Math.sin((p - this._p3) * Tau / this.period) + 1;
  }

  public static create(amplitude: number, period: number): ElasticOut {
    return new ElasticOut(amplitude, period);
  }
}

export class ElasticInOut {
  private _p3: number;

  constructor(protected amplitude: number = Amplitude, protected period: number = Period) {
    this._p3 = Math.asin(1 / (amplitude = Math.max(1, amplitude))) * (period /= Tau);
  }

  public getRatio(p: number): number {
    if ((p = p * 2) < 0) {
      return -(this.amplitude * Math.pow(2, 10 * (p -= 1)) * Math.sin((p - this._p3) * Tau / this.period)) / 2;
    } else {
      return (this.amplitude * Math.pow(2, -10 * (p -= 1)) * Math.sin((p - this._p3) * Tau / this.period) + 2) / 2;
    }
  }

  public static create(amplitude: number, period: number): ElasticInOut {
    return new ElasticInOut(amplitude, period);
  }
}

export class EasingElastic {
  public static easingIn: ElasticIn       = new ElasticIn();
  public static easingOut: ElasticOut     = new ElasticOut();
  public static easingInOut: ElasticInOut = new ElasticInOut();
}
