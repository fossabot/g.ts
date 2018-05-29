/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {PolyIn, PolyInOut, PolyOut} from './poly';

export class Quart {
  public static easeIn: PolyIn = PolyIn.create(4);

  public static easeOut: PolyOut = PolyOut.create(4);

  public static easeInOut: PolyInOut = PolyInOut.create(4);
}
