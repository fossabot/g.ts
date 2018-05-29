/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {EasingBack} from './back';

export class ExpoIn {

  public getRatio(p: number): number {
    return Math.pow(2, 10 * (p - 1)) - 0.001;
  }
}

export class ExpoOut {

  public getRatio(p: number): number {
    return 1 - Math.pow(2, -10 * p);
  }
}

export class ExpoInOut {

  public getRatio(p: number): number {
    return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
  }
}

export class EasingExpo {
  public easeIn: ExpoIn       = new ExpoIn();
  public easeOut: ExpoOut     = new ExpoOut();
  public easeInOut: ExpoInOut = new ExpoInOut();
}
