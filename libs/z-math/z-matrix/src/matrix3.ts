/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Matrix4} from './matrix4';
import {Quaternion} from './quaternion';
import {Vector2} from './vector2';
import {Vector3} from './vector3';

export class Matrix3 {
  private values = new Float32Array(9);

  constructor(values: number[] = null) {
    if (values) {
      this.init(values);
    }
  }

  public at(index: number): number {
    return this.values[index];
  }

  /**
   * Create a new {@class Matrix3} with the given values
   * @param {number[]} values
   * @returns {Matrix3} A new {@class Matrix3}
   */
  public init(values: number[]): Matrix3 {
    for (let i = 0; i < 9; i++) {
      this.values[i] = values[i];
    }

    return this;
  }

  /**
   * Reset the {@class Matrix3}
   */
  public reset(): void {
    for (let i = 0; i < 9; i++) {
      this.values[i] = 0;
    }
  }

  public copy(dest: Matrix3 = null): Matrix3 {
    if (!dest) {
      dest = new Matrix3();
    }

    for (let i = 0; i < 9; i++) {
      dest.values[i] = this.values[i];
    }

    return dest;
  }

  public all(): number[] {
    let data: number[] = [];
    for (let i = 0; i < 9; i++) {
      data[i] = this.values[i];
    }

    return data;
  }

  public row(index: number): number[] {
    return [
      this.values[index * 3],
      this.values[index * 3 + 1],
      this.values[index * 3 + 2],
    ];
  }

  public col(index: number): number[] {
    return [
      this.values[index],
      this.values[index + 3],
      this.values[index + 6],
    ];
  }

  /**
   * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
   *
   * @param {Matrix3} b
   * @returns {boolean}
   */
  public exactEquals(b: Matrix3) {
    return (
      this.values[0] === b.at(0) &&
      this.values[1] === b.at(1) &&
      this.values[2] === b.at(2) &&
      this.values[3] === b.at(3) &&
      this.values[4] === b.at(4) &&
      this.values[5] === b.at(5) &&
      this.values[6] === b.at(6) &&
      this.values[7] === b.at(7) &&
      this.values[8] === b.at(8)
    );
  }

  /**
   *  Returns whether or not the matrices have approximately the same elements in the same position.
   *
   * @param {Matrix3} matrix
   * @param {number} threshold
   * @returns {boolean}
   */
  public equals(matrix: Matrix3, threshold = EPSILON): boolean {
    for (let i = 0; i < 9; i++) {
      if (Math.abs(this.values[i] - matrix.at(i)) >
        threshold * Math.max(1.0, Math.abs(this.values[i]), Math.abs(matrix.at(i)))) {
        return false;
      }
    }
    return true;
  }

  /**
   * Calculates the determinant of {@class Matrix3}
   *
   * @returns {number}
   */
  public determinant(): number {
    const a00 = this.values[0], a01 = this.values[1], a02 = this.values[2];
    const a10 = this.values[3], a11 = this.values[4], a12 = this.values[5];
    const a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];

    return (
      a00 * (a22 * a11 - a12 * a21) +
      a01 * (-a22 * a10 + a12 * a20) +
      a02 * (a21 * a10 - a11 * a20)
    );
  }

  /**
   * Set a mat3 to the identity matrix
   *
   * @returns {Matrix3}
   */
  public identity(): Matrix3 {
    this.values[0] = 1;
    this.values[1] = 0;
    this.values[2] = 0;
    this.values[3] = 0;
    this.values[4] = 1;
    this.values[5] = 0;
    this.values[6] = 0;
    this.values[7] = 0;
    this.values[8] = 1;

    return this;
  }

  /**
   * Transpose the {@class Matrix3}
   *
   * @returns {Matrix3}
   */
  public transpose(): Matrix3 {
    const temp01 = this.values[1],
          temp02 = this.values[2],
          temp12 = this.values[5];

    this.values[1] = this.values[3];
    this.values[2] = this.values[6];
    this.values[3] = temp01;
    this.values[5] = this.values[7];
    this.values[6] = temp02;
    this.values[7] = temp12;

    return this;
  }

  /**
   * Inverts a {@class Matrix3}
   * @returns {Matrix3}
   */
  public inverse(): Matrix3 {
    const a00 = this.values[0], a01 = this.values[1], a02 = this.values[2];
    const a10 = this.values[3], a11 = this.values[4], a12 = this.values[5];
    const a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];

    const det01 = a22 * a11 - a12 * a21,
          det11 = -a22 * a10 + a12 * a20,
          det21 = a21 * a10 - a11 * a20;

    let det = a00 * det01 + a01 * det11 + a02 * det21;

    if (!det) {
      return null;
    }

    det = 1.0 / det;

    this.values[0] = det01 * det;
    this.values[1] = (-a22 * a01 + a02 * a21) * det;
    this.values[2] = (a12 * a01 - a02 * a11) * det;
    this.values[3] = det11 * det;
    this.values[4] = (a22 * a00 - a02 * a20) * det;
    this.values[5] = (-a12 * a00 + a02 * a10) * det;
    this.values[6] = det21 * det;
    this.values[7] = (-a21 * a00 + a01 * a20) * det;
    this.values[8] = (a11 * a00 - a01 * a10) * det;

    return this;
  }

  /**
   * Calculates the adjugate of {@class Matrix3}
   *
   * @returns {Matrix3}
   */
  public adjoint() {
    const a00 = this.values[0];
    const a01 = this.values[1];
    const a02 = this.values[2];
    const a10 = this.values[3];
    const a11 = this.values[4];
    const a12 = this.values[5];
    const a20 = this.values[6];
    const a21 = this.values[7];
    const a22 = this.values[8];

    this.values[0] = a11 * a22 - a12 * a21;
    this.values[1] = a02 * a21 - a01 * a22;
    this.values[2] = a01 * a12 - a02 * a11;
    this.values[3] = a12 * a20 - a10 * a22;
    this.values[4] = a00 * a22 - a02 * a20;
    this.values[5] = a02 * a10 - a00 * a12;
    this.values[6] = a10 * a21 - a11 * a20;
    this.values[7] = a01 * a20 - a00 * a21;
    this.values[8] = a00 * a11 - a01 * a10;
    return this;
  }

  public multiply(matrix: Matrix3): Matrix3 {
    const a00 = this.values[0], a01 = this.values[1], a02 = this.values[2];
    const a10 = this.values[3], a11 = this.values[4], a12 = this.values[5];
    const a20 = this.values[6], a21 = this.values[7], a22 = this.values[8];

    const b00 = matrix.at(0), b01 = matrix.at(1), b02 = matrix.at(2);
    const b10 = matrix.at(3), b11 = matrix.at(4), b12 = matrix.at(5);
    const b20 = matrix.at(6), b21 = matrix.at(7), b22 = matrix.at(8);

    this.values[0] = b00 * a00 + b01 * a10 + b02 * a20;
    this.values[1] = b00 * a01 + b01 * a11 + b02 * a21;
    this.values[2] = b00 * a02 + b01 * a12 + b02 * a22;

    this.values[3] = b10 * a00 + b11 * a10 + b12 * a20;
    this.values[4] = b10 * a01 + b11 * a11 + b12 * a21;
    this.values[5] = b10 * a02 + b11 * a12 + b12 * a22;

    this.values[6] = b20 * a00 + b21 * a10 + b22 * a20;
    this.values[7] = b20 * a01 + b21 * a11 + b22 * a21;
    this.values[8] = b20 * a02 + b21 * a12 + b22 * a22;

    return this;
  }

  public toMatrix4(result?: Matrix4): Matrix4 {
    if (!result) {
      result = new Matrix4();
    }

    result.init([
      this.values[0],
      this.values[1],
      this.values[2],
      0,

      this.values[3],
      this.values[4],
      this.values[5],
      0,

      this.values[6],
      this.values[7],
      this.values[8],
      0,

      0,
      0,
      0,
      1,
    ]);

    return result;
  }

  public toQuaternion(result?: Quaternion): Quaternion {
    if (!result) {
      result = new Quaternion();
    }

    const m00 = this.values[0], m01 = this.values[1], m02 = this.values[2];
    const m10 = this.values[3], m11 = this.values[4], m12 = this.values[5];
    const m20 = this.values[6], m21 = this.values[7], m22 = this.values[8];

    const fourXSquaredMinus1 = m00 - m11 - m22;
    const fourYSquaredMinus1 = m11 - m00 - m22;
    const fourZSquaredMinus1 = m22 - m00 - m11;
    const fourWSquaredMinus1 = m00 + m11 + m22;

    let biggestIndex = 0;

    let fourBiggestSquaredMinus1 = fourWSquaredMinus1;

    if (fourXSquaredMinus1 > fourBiggestSquaredMinus1) {
      fourBiggestSquaredMinus1 = fourXSquaredMinus1;
      biggestIndex             = 1;
    }

    if (fourYSquaredMinus1 > fourBiggestSquaredMinus1) {
      fourBiggestSquaredMinus1 = fourYSquaredMinus1;
      biggestIndex             = 2;
    }

    if (fourZSquaredMinus1 > fourBiggestSquaredMinus1) {
      fourBiggestSquaredMinus1 = fourZSquaredMinus1;
      biggestIndex             = 3;
    }

    const biggestVal = Math.sqrt(fourBiggestSquaredMinus1 + 1) * 0.5;
    const mult       = 0.25 / biggestVal;

    switch (biggestIndex) {
      case 0:

        result.w = biggestVal;
        result.x = (m12 - m21) * mult;
        result.y = (m20 - m02) * mult;
        result.z = (m01 - m10) * mult;

        break;

      case 1:

        result.w = (m12 - m21) * mult;
        result.x = biggestVal;
        result.y = (m01 + m10) * mult;
        result.z = (m20 + m02) * mult;

        break;

      case 2:

        result.w = (m20 - m02) * mult;
        result.x = (m01 + m10) * mult;
        result.y = biggestVal;
        result.z = (m12 + m21) * mult;

        break;

      case 3:

        result.w = (m01 - m10) * mult;
        result.x = (m20 + m02) * mult;
        result.y = (m12 + m21) * mult;
        result.z = biggestVal;

        break;
    }

    return result;
  }

  /**
   * Translate a {@class Matrix3} by the given vector
   *
   * @param {Vector2} v vector to translate by
   * @returns {this}
   */
  public translate(v: Vector2) {
    const x = v[0];
    const y = v[1];

    const a00 = this.values[0];
    const a01 = this.values[1];
    const a02 = this.values[2];
    const a10 = this.values[3];
    const a11 = this.values[4];
    const a12 = this.values[5];
    const a20 = this.values[6];
    const a21 = this.values[7];
    const a22 = this.values[8];

    this.values[0] = a00;
    this.values[1] = a01;
    this.values[2] = a02;

    this.values[3] = a10;
    this.values[4] = a11;
    this.values[5] = a12;

    this.values[6] = x * a00 + y * a10 + a20;
    this.values[7] = x * a01 + y * a11 + a21;
    this.values[8] = x * a02 + y * a12 + a22;
    return this;
  }

  /**
   * Rotates a {@class Matrix3} by the given angle
   *
   * @param {number} rad the angle to rotate the matrix by
   * @returns {this}
   */
  public rotate(rad: number) {
    const a00 = this.values[0];
    const a01 = this.values[1];
    const a02 = this.values[2];
    const a10 = this.values[3];
    const a11 = this.values[4];
    const a12 = this.values[5];
    const a20 = this.values[6];
    const a21 = this.values[7];
    const a22 = this.values[8];
    const s   = Math.sin(rad);
    const c   = Math.cos(rad);

    this.values[0] = c * a00 + s * a10;
    this.values[1] = c * a01 + s * a11;
    this.values[2] = c * a02 + s * a12;

    this.values[3] = c * a10 - s * a00;
    this.values[4] = c * a11 - s * a01;
    this.values[5] = c * a12 - s * a02;

    this.values[6] = a20;
    this.values[7] = a21;
    this.values[8] = a22;
    return this;
  }

  public scale(v: Vector2) {
    const x = v[0];
    const y = v[1];

    this.values[0] = x * this.values[0];
    this.values[1] = x * this.values[1];
    this.values[2] = x * this.values[2];

    this.values[3] = y * this.values[3];
    this.values[4] = y * this.values[4];
    this.values[5] = y * this.values[5];

    this.values[6] = this.values[6];
    this.values[7] = this.values[7];
    this.values[8] = this.values[8];
    return this;
  }

  /**
   * Clone
   *
   * @returns {Matrix3} A new {@class Matrix3}
   */
  public clone() {
    return this.copy();
  }

  public static product(m1: Matrix3, m2: Matrix3, result: Matrix3 = null): Matrix3 {
    if (!result) {
      result = new Matrix3();
    }

    const a00 = m1.at(0), a01 = m1.at(1), a02 = m1.at(2);
    const a10 = m1.at(3), a11 = m1.at(4), a12 = m1.at(5);
    const a20 = m1.at(6), a21 = m1.at(7), a22 = m1.at(8);

    const b00 = m2.at(0), b01 = m2.at(1), b02 = m2.at(2);
    const b10 = m2.at(3), b11 = m2.at(4), b12 = m2.at(5);
    const b20 = m2.at(6), b21 = m2.at(7), b22 = m2.at(8);

    result.init([
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,

      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,

      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ]);

    return result;
  }

  public static fromMatrix4(a: Matrix4) {
    const out     = new Matrix3();
    out.values[0] = a.at(0);
    out.values[1] = a.at(1);
    out.values[2] = a.at(2);
    out.values[3] = a.at(4);
    out.values[4] = a.at(5);
    out.values[5] = a.at(6);
    out.values[6] = a.at(8);
    out.values[7] = a.at(9);
    out.values[8] = a.at(10);
    return out;
  }

  public static multiplyVector2(m: Matrix3, vector: Vector2, result: Vector2 = null): Vector2 {
    const x = vector.x,
          y = vector.y;

    if (result) {
      result.xy = [
        x * m.at(0) + y * m.at(3) + m.at(6),
        x * m.at(1) + y * m.at(4) + m.at(7),
      ];

      return result;
    } else {
      return new Vector2([
        x * m.at(0) + y * m.at(3) + m.at(6),
        x * m.at(1) + y * m.at(4) + m.at(7),
      ]);
    }
  }

  public static multiplyVector3(m: Matrix3, vector: Vector3, result: Vector3 = null): Vector3 {
    let x = vector.x,
        y = vector.y,
        z = vector.z;

    if (result) {
      result.xyz = [
        x * m.at(0) + y * m.at(3) + z * m.at(6),
        x * m.at(1) + y * m.at(4) + z * m.at(7),
        x * m.at(2) + y * m.at(5) + z * m.at(8),
      ];

      return result;
    } else {
      return new Vector3([
        x * m.at(0) + y * m.at(3) + z * m.at(6),
        x * m.at(1) + y * m.at(4) + z * m.at(7),
        x * m.at(2) + y * m.at(5) + z * m.at(8),
      ]);
    }
  }

}
