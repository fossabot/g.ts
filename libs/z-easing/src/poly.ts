/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const Exponent = 3;

export class PolyIn {
  constructor(protected exponent = Exponent) {
  }

  public getRatio(p: number): number {
    return Math.pow(p, this.exponent);
  }

  public static create(exponent: number) {
    return new PolyIn(exponent);
  }
}

export class PolyOut {
  constructor(protected exponent = Exponent) {
  }

  public getRatio(p: number): number {
    return 1 - Math.pow(1 - p, this.exponent);
  }

  public static create(exponent: number) {
    return new PolyOut(exponent);
  }
}

export class PolyInOut {
  constructor(protected exponent = Exponent) {
  }

  public getRatio(p: number): number {
    if ((p *= 2) <= 1) {
      return Math.pow(p, this.exponent) / 2;
    } else {
      return (2 - Math.pow(2 - p, this.exponent)) / 2;
    }
  }

  public static create(exponent: number) {
    return new PolyInOut(exponent);
  }
}

export class EasingPoly {
  public static easeIn: PolyIn       = new PolyIn();
  public static easeOut: PolyOut     = new PolyOut();
  public static easeInOut: PolyInOut = new PolyInOut();
}
