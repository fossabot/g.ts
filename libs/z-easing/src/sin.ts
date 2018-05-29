/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const _HALF_PI = Math.PI / 2;

export class SineIn {

  public getRatio(p: number): number {
    return -Math.cos(p * _HALF_PI) + 1;
  }
}

export class SineOut {

  public getRatio(p: number): number {
    return Math.sin(p * _HALF_PI);
  }
}

export class SineInOut {

  public getRatio(p: number): number {
    return -0.5 * (Math.cos(Math.PI * p) - 1);
  }
}

export class EasingSine {
  public static easeIn: SineIn       = new SineIn();
  public static easeOut: SineOut     = new SineOut();
  public static easeInOut: SineInOut = new SineInOut();
}
