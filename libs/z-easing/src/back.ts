/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const Overshoot = 1.70158;

export class BackIn {

  constructor(protected overshoot: number = Overshoot) {
  }

  public getRatio(p: number): number {
    return p * p * ((this.overshoot + 1) * p - this.overshoot);
  }

  public static create(overshoot: number = Overshoot) {
    return new BackIn(overshoot);
  }
}

export class BackOut {

  constructor(protected overshoot: number = Overshoot) {
  }

  public getRatio(p: number): number {
    return ((p = p - 1) * p * ((this.overshoot + 1) * p + this.overshoot) + 1);
  }

  public static create(overshoot: number = Overshoot) {
    return new BackOut(overshoot);
  }
}

export class BackInOut {

  constructor(protected overshoot: number = Overshoot) {
  }

  public getRatio(p: number): number {
    return ((p *= 2) < 1) ? 0.5 * p * p * ((this.overshoot + 1) * p - this.overshoot) : 0.5 * ((p -= 2) * p * ((this.overshoot + 1) * p + this.overshoot) + 2);
  }

  public static create(overshoot: number = Overshoot) {
    return new BackInOut(overshoot);
  }
}

export class EasingBack {
  public static easeIn: BackIn       = new BackIn();
  public static easeOut: BackOut     = new BackOut();
  public static easeInOut: BackInOut = new BackInOut();
}
