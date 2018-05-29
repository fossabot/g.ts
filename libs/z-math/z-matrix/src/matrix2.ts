/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Vector2} from './vector2';

/**
 * use row-major, because such as matrix can represent as
 * ```
 *  [[1, 0, 0],
 *   [0, 1, 0],
 *   [0, 0, 1]]
 * ```
 */
export class Matrix2 {
  private values = new Float32Array(4);

  constructor(values: number[] = null) {
    if (values) {
      this.init(values);
    }
  }

  public at(index: number): number {
    return this.values[index];
  }

  public init(values: number[]): Matrix2 {
    for (let i = 0; i < 4; i++) {
      this.values[i] = values[i];
    }

    return this;
  }

  public reset(): void {
    for (let i = 0; i < 4; i++) {
      this.values[i] = 0;
    }
  }

  public copy(dest: Matrix2 = null): Matrix2 {
    if (!dest) {
      dest = new Matrix2();
    }

    for (let i = 0; i < 4; i++) {
      dest.values[i] = this.values[i];
    }

    return dest;
  }

  public all(): number[] {
    let data: number[] = [];
    for (let i = 0; i < 4; i++) {
      data[i] = this.values[i];
    }

    return data;
  }

  public row(index: number): number[] {
    return [
      this.values[index * 2],
      this.values[index * 2 + 1],
    ];
  }

  public col(index: number): number[] {
    return [
      this.values[index],
      this.values[index + 2],
    ];
  }

  public index(row: number, col: number) {
    return (row * 2) + col;
  }

  public setValues(arg0, arg1, arg2, arg3) {

  }

  public equals(matrix: Matrix2, threshold = EPSILON): boolean {
    for (let i = 0; i < 4; i++) {
      if (Math.abs(this.values[i] - matrix.at(i)) > threshold) {
        return false;
      }
    }

    return true;
  }

  public determinant(): number {
    return this.values[0] * this.values[3] - this.values[2] * this.values[1];
  }

  public identity(): Matrix2 {
    this.values[0] = 1;
    this.values[1] = 0;
    this.values[2] = 0;
    this.values[3] = 1;

    return this;
  }

  public transpose(): Matrix2 {
    let temp = this.values[1];

    this.values[1] = this.values[2];
    this.values[2] = temp;

    return this;
  }

  public inverse(): Matrix2 {
    let det = this.determinant();

    if (!det) {
      return null;
    }

    det = 1.0 / det;

    this.values[0] = det * (this.values[3]);
    this.values[1] = det * (-this.values[1]);
    this.values[2] = det * (-this.values[2]);
    this.values[3] = det * (this.values[0]);

    return this;
  }

  public multiply(matrix: Matrix2): Matrix2 {
    let a11 = this.values[0],
        a12 = this.values[1],
        a21 = this.values[2],
        a22 = this.values[3];

    this.values[0] = a11 * matrix.at(0) + a12 * matrix.at(2);
    this.values[1] = a11 * matrix.at(1) + a12 * matrix.at(3);
    this.values[2] = a21 * matrix.at(0) + a22 * matrix.at(2);
    this.values[3] = a21 * matrix.at(1) + a22 * matrix.at(3);

    return this;
  }

  public rotate(angle: number): Matrix2 {
    let a11 = this.values[0],
        a12 = this.values[1],
        a21 = this.values[2],
        a22 = this.values[3];

    let sin = Math.sin(angle),
        cos = Math.cos(angle);

    this.values[0] = a11 * cos + a12 * sin;
    this.values[1] = a11 * -sin + a12 * cos;
    this.values[2] = a21 * cos + a22 * sin;
    this.values[3] = a21 * -sin + a22 * cos;

    return this;
  }

  public multiplyVector2(vector: Vector2, result: Vector2 = null): Vector2 {
    let x = vector.x,
        y = vector.y;

    if (result) {
      result.xy = [
        x * this.values[0] + y * this.values[1],
        x * this.values[2] + y * this.values[3],
      ];

      return result;
    } else {
      return new Vector2([
        x * this.values[0] + y * this.values[1],
        x * this.values[2] + y * this.values[3],
      ]);
    }
  }

  public scale(vector: Vector2): Matrix2 {
    let a11 = this.values[0],
        a12 = this.values[1],
        a21 = this.values[2],
        a22 = this.values[3];

    let x = vector.x,
        y = vector.y;

    this.values[0] = a11 * x;
    this.values[1] = a12 * y;
    this.values[2] = a21 * x;
    this.values[3] = a22 * y;

    return this;
  }

  public clone() {
    return this.copy();
  }

  public static product(m1: Matrix2, m2: Matrix2, result: Matrix2 = null): Matrix2 {
    let a11 = m1.at(0),
        a12 = m1.at(1),
        a21 = m1.at(2),
        a22 = m1.at(3);

    if (!result) {
      result = new Matrix2();
    }
    result.init([
      a11 * m2.at(0) + a12 * m2.at(2),
      a11 * m2.at(1) + a12 * m2.at(3),
      a21 * m2.at(0) + a22 * m2.at(2),
      a21 * m2.at(1) + a22 * m2.at(3),
    ]);

    return result;
  }

}
