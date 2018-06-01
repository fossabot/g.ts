/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Vector2} from "./vector2";

export class Aabb2 {
  private _min: Vector2;
  private _max: Vector2;

  public get min() {
    return this._min;
  }

  public get max() {
    return this._max;
  }

  public get center() {
    return this._min.clone().add(this._max).scale(0.5);
  }

  public copy(dest: Aabb2) {
    if (!dest) {
      dest = new Aabb2();
    }

    dest._min = this._min;
    dest._max = this._max;
  }

}
