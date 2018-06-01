/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Matrix2} from './matrix2';
import {Matrix3} from './matrix3';
import {Vector3} from './vector3';

export class Vector2 {
  public static zero = new Vector2([0, 0]);

  private values = new Float32Array(2);

  get x(): number {
    return this.values[0];
  }

  get y(): number {
    return this.values[1];
  }

  get xy(): number[] {
    return [
      this.values[0],
      this.values[1],
    ];
  }

  set x(value: number) {
    this.values[0] = value;
  }

  set y(value: number) {
    this.values[1] = value;
  }

  set xy(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
  }

  constructor(values: number[] = null) {
    if (values) {
      this.xy = values;
    }
  }

  public at(index: number): number {
    return this.values[index];
  }

  public reset(): void {
    this.x = 0;
    this.y = 0;
  }

  public copy(out?: Vector2): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    out.x = this.x;
    out.y = this.y;

    return out;
  }

  public negate(out: Vector2 = null): Vector2 {
    if (!out) {
      out = this;
    }

    out.x = -this.x;
    out.y = -this.y;

    return out;
  }

  public equals(vector: Vector2, threshold = EPSILON): boolean {
    if (Math.abs(this.x - vector.x) > threshold) {
      return false;
    }

    if (Math.abs(this.y - vector.y) > threshold) {
      return false;
    }

    return true;
  }

  public length(): number {
    return Math.sqrt(this.squaredLength());
  }

  public squaredLength(): number {
    let x = this.x,
        y = this.y;

    return (x * x + y * y);
  }

  public add(vector: Vector2): Vector2 {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  public subtract(vector: Vector2): Vector2 {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }

  public multiply(vector: Vector2): Vector2 {
    this.x *= vector.x;
    this.y *= vector.y;

    return this;
  }

  public divide(vector: Vector2): Vector2 {
    this.x /= vector.x;
    this.y /= vector.y;

    return this;
  }

  /**
   * Math.ceil the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @returns {vec2} out
   */
  public ceil(out: Vector2 = null) {
    if (!out) {
      out = this;
    }
    out.x = Math.ceil(this.x);
    out.y = Math.ceil(this.y);
    return out;
  }

  /**
   * Math.floor the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @returns {vec2} out
   */
  public floor(out: Vector2 = null) {
    if (!out) {
      out = this;
    }
    out.x = Math.floor(this.x);
    out.y = Math.floor(this.y);
    return out;
  }

  /**
   * Math.round the components of a vec2
   *
   * @param {vec2} out the receiving vector
   * @returns {vec2} out
   */
  public round(out: Vector2 = null) {
    if (!out) {
      out = new Vector2();
    }

    out.x = Math.round(this.x);
    out.y = Math.round(this.y);
    return out;
  }

  public scale(value: number, out: Vector2 = null): Vector2 {
    if (!out) {
      out = this;
    }

    out.x *= value;
    out.y *= value;

    return out;
  }

  public normalize(out: Vector2 = null): Vector2 {
    if (!out) {
      out = this;
    }

    let length = this.length();

    if (length === 1) {
      return this;
    }

    if (length === 0) {
      out.x = 0;
      out.y = 0;

      return out;
    }

    length = 1.0 / length;

    out.x *= length;
    out.y *= length;

    return out;
  }

  public multiplyMatrix2(matrix: Matrix2, out: Vector2 = null): Vector2 {
    if (!out) {
      this.copy(out);
    }

    return matrix.transform(out);
  }

  public vertical(flag, out?: Vector2) {
    if (!out) {
      out = this;
    }

    const x = this.x;
    const y = this.y;

    if (flag) {
      out.x = y;
      out.y = -1 * x;
    } else {
      out.x = -1 * y;
      out.y = x;
    }

    return out;
  }

  public clone() {
    return this.copy();
  }

  public multiplyMatrix3(matrix: Matrix3, out: Vector2 = null): Vector2 {
    if (!out) {
      out = this;
    }

    return Matrix3.multiplyVector2(matrix, this, out);
  }

  public static cross(vector: Vector2, vector2: Vector2, out: Vector3 = null): Vector3 {
    if (!out) {
      out = new Vector3();
    }

    let x = vector.x,
        y = vector.y;

    let x2 = vector2.x,
        y2 = vector2.y;

    let z = x * y2 - y * x2;

    out.x = 0;
    out.y = 0;
    out.z = z;

    return out;
  }

  public static dot(vector: Vector2, vector2: Vector2): number {
    return (vector.x * vector2.x + vector.y * vector2.y);
  }

  public static distance(vector: Vector2, vector2: Vector2): number {
    return Math.sqrt(this.squaredDistance(vector, vector2));
  }

  public static squaredDistance(vector: Vector2, vector2: Vector2): number {
    let x = vector2.x - vector.x,
        y = vector2.y - vector.y;

    return (x * x + y * y);
  }

  public static direction(vector: Vector2, vector2: Vector2, out: Vector2 = null): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    let x = vector.x - vector2.x,
        y = vector.y - vector2.y;

    let length = Math.sqrt(x * x + y * y);

    if (length === 0) {
      out.x = 0;
      out.y = 0;

      return out;
    }

    length = 1 / length;

    out.x = x * length;
    out.y = y * length;

    return out;
  }

  public static mix(vector: Vector2, vector2: Vector2, time: number, out: Vector2 = null): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    let x = vector.x,
        y = vector.y;

    let x2 = vector2.x,
        y2 = vector2.y;

    out.x = x + time * (x2 - x);
    out.y = y + time * (y2 - y);

    return out;
  }

  public static sum(vector: Vector2, vector2: Vector2, out: Vector2 = null): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    out.x = vector.x + vector2.x;
    out.y = vector.y + vector2.y;

    return out;
  }

  public static difference(vector: Vector2, vector2: Vector2, out: Vector2 = null): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    out.x = vector.x - vector2.x;
    out.y = vector.y - vector2.y;

    return out;
  }

  public static product(vector: Vector2, vector2: Vector2, out: Vector2 = null): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    out.x = vector.x * vector2.x;
    out.y = vector.y * vector2.y;

    return out;
  }

  public static quotient(vector: Vector2, vector2: Vector2, out: Vector2 = null): Vector2 {
    if (!out) {
      out = new Vector2();
    }

    out.x = vector.x / vector2.x;
    out.y = vector.y / vector2.y;

    return out;
  }

  /**
   * Returns the minimum of two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {vec2} out the receiving vector
   * @returns {vec2} out
   */
  public static min(a, b, out: Vector2 = null) {
    if (!out) {
      out = new Vector2();
    }
    out.x = Math.min(a.x, b.x);
    out.y = Math.min(a.y, b.y);
    return out;
  }

  /**
   * Returns the maximum of two vec2's
   *
   * @param {vec2} a the first operand
   * @param {vec2} b the second operand
   * @param {vec2} out the receiving vector
   * @returns {vec2} out
   */
  public static max(a, b, out: Vector2 = null) {
    if (!out) {
      out = new Vector2();
    }
    out.x = Math.max(a.x, b.x);
    out.y = Math.max(a.y, b.y);
    return out;
  }

  public static lerp(a: Vector2, b: Vector2, t: number, out: Vector2 = null) {
    if (!out) {
      out = new Vector2();
    }

    const ax = a.x;
    const ay = a.y;
    out.x    = ax + t * (b.x - ax);
    out.y    = ay + t * (b.y - ay);
    return out;
  }

  public static angle(v1, v2) {
    const theta = Vector2.dot(v1, v2) / (v1.length() * v2.length());
    return Math.acos(Math.max(Math.min(theta, -1), 1));
  }
}
