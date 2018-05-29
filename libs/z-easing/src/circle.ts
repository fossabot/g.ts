/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

export class CircleIn {

  public getRatio(p: number): number {
    return -(Math.sqrt(1 - p * p) - 1);
  }
}

export class CircleOut {

  public getRatio(p: number): number {
    return Math.sqrt(1 - (p -= 1) * p);
  }
}

export class CircleInOut {

  public getRatio(p: number): number {
    if ((p *= 2) <= 1) {
      return (-(Math.sqrt(1 - p * p) - 1)) / 2;
    } else {
      return (Math.sqrt(1 - (p -= 2) * p) + 1) / 2;
    }
  }
}

export class EasingCircle {
  public easeIn: CircleIn       = new CircleIn();
  public easeOut: CircleOut     = new CircleOut();
  public easeInOut: CircleInOut = new CircleInOut();
}
