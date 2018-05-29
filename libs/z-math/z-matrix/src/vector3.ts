/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Matrix3} from './matrix3';
import {Quaternion} from './quaternion';

export class Vector3 {
  public static zero = new Vector3([0, 0, 0]);

  public static up      = new Vector3([0, 1, 0]);
  public static right   = new Vector3([1, 0, 0]);
  public static forward = new Vector3([0, 0, 1]);

  private values = new Float32Array(3);

  get x(): number {
    return this.values[0];
  }

  get y(): number {
    return this.values[1];
  }

  get z(): number {
    return this.values[2];
  }

  get xy(): number[] {
    return [
      this.values[0],
      this.values[1],
    ];
  }

  get xyz(): number[] {
    return [
      this.values[0],
      this.values[1],
      this.values[2],
    ];
  }

  set x(value: number) {
    this.values[0] = value;
  }

  set y(value: number) {
    this.values[1] = value;
  }

  set z(value: number) {
    this.values[2] = value;
  }

  set xy(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
  }

  set xyz(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
    this.values[2] = values[2];
  }

  constructor(values: number[] = null) {
    if (values) {
      this.xyz = values;
    }
  }

  public at(index: number): number {
    return this.values[index];
  }

  public reset(): void {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }

  public copy(dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    dest.x = this.x;
    dest.y = this.y;
    dest.z = this.z;

    return dest;
  }

  public negate(dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = this;
    }

    dest.x = -this.x;
    dest.y = -this.y;
    dest.z = -this.z;

    return dest;
  }

  public equals(vector: Vector3, threshold = EPSILON): boolean {
    if (Math.abs(this.x - vector.x) > threshold) {
      return false;
    }

    if (Math.abs(this.y - vector.y) > threshold) {
      return false;
    }

    if (Math.abs(this.z - vector.z) > threshold) {
      return false;
    }

    return true;
  }

  public length(): number {
    return Math.sqrt(this.squaredLength());
  }

  public squaredLength(): number {
    let x = this.x,
        y = this.y,
        z = this.z;

    return (x * x + y * y + z * z);
  }

  public add(vector: Vector3): Vector3 {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;

    return this;
  }

  public subtract(vector: Vector3): Vector3 {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;

    return this;
  }

  public multiply(vector: Vector3): Vector3 {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;

    return this;
  }

  public divide(vector: Vector3): Vector3 {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;

    return this;
  }

  public scale(value: number, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = this;
    }

    dest.x *= value;
    dest.y *= value;
    dest.z *= value;

    return dest;
  }

  public normalize(dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = this;
    }

    let length = this.length();

    if (length === 1) {
      return this;
    }

    if (length === 0) {
      dest.x = 0;
      dest.y = 0;
      dest.z = 0;

      return dest;
    }

    length = 1.0 / length;

    dest.x *= length;
    dest.y *= length;
    dest.z *= length;

    return dest;
  }

  public multiplyByMat3(matrix: Matrix3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = this;
    }

    return matrix.multiplyVector3(this, dest);
  }

  public multiplyByQuaternion(quat: Quaternion, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = this;
    }

    return quat.multiplyVector3(this, dest);
  }

  public toQuaternion(dest: Quaternion = null): Quaternion {
    if (!dest) {
      dest = new Quaternion();
    }

    let c = new Vector3();
    let s = new Vector3();

    c.x = Math.cos(this.x * 0.5);
    s.x = Math.sin(this.x * 0.5);

    c.y = Math.cos(this.y * 0.5);
    s.y = Math.sin(this.y * 0.5);

    c.z = Math.cos(this.z * 0.5);
    s.z = Math.sin(this.z * 0.5);

    dest.x = s.x * c.y * c.z - c.x * s.y * s.z;
    dest.y = c.x * s.y * c.z + s.x * c.y * s.z;
    dest.z = c.x * c.y * s.z - s.x * s.y * c.z;
    dest.w = c.x * c.y * c.z + s.x * s.y * s.z;

    return dest;
  }

  public static cross(vector: Vector3, vector2: Vector3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    const x = vector.x,
          y = vector.y,
          z = vector.z;

    const x2 = vector2.x,
          y2 = vector2.y,
          z2 = vector2.z;

    dest.x = y * z2 - z * y2;
    dest.y = z * x2 - x * z2;
    dest.z = x * y2 - y * x2;

    return dest;
  }

  public static dot(vector: Vector3, vector2: Vector3): number {
    const x = vector.x,
          y = vector.y,
          z = vector.z;

    const x2 = vector2.x,
          y2 = vector2.y,
          z2 = vector2.z;

    return (x * x2 + y * y2 + z * z2);
  }

  public static distance(vector: Vector3, vector2: Vector3): number {
    const x = vector2.x - vector.x,
          y = vector2.y - vector.y,
          z = vector2.z - vector.z;

    return Math.sqrt(this.squaredDistance(vector, vector2));
  }

  public static squaredDistance(vector: Vector3, vector2: Vector3): number {
    const x = vector2.x - vector.x,
          y = vector2.y - vector.y,
          z = vector2.z - vector.z;

    return (x * x + y * y + z * z);
  }

  public static direction(vector: Vector3, vector2: Vector3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    const x = vector.x - vector2.x,
          y = vector.y - vector2.y,
          z = vector.z - vector2.z;

    let length = Math.sqrt(x * x + y * y + z * z);

    if (length === 0) {
      dest.x = 0;
      dest.y = 0;
      dest.z = 0;

      return dest;
    }

    length = 1 / length;

    dest.x = x * length;
    dest.y = y * length;
    dest.z = z * length;

    return dest;
  }

  public static mix(vector: Vector3, vector2: Vector3, time: number, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    dest.x = vector.x + time * (vector2.x - vector.x);
    dest.y = vector.y + time * (vector2.y - vector.y);
    dest.z = vector.z + time * (vector2.z - vector.z);

    return dest;
  }

  public static sum(vector: Vector3, vector2: Vector3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    dest.x = vector.x + vector2.x;
    dest.y = vector.y + vector2.y;
    dest.z = vector.z + vector2.z;

    return dest;
  }

  public static difference(vector: Vector3, vector2: Vector3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    dest.x = vector.x - vector2.x;
    dest.y = vector.y - vector2.y;
    dest.z = vector.z - vector2.z;

    return dest;
  }

  public static product(vector: Vector3, vector2: Vector3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    dest.x = vector.x * vector2.x;
    dest.y = vector.y * vector2.y;
    dest.z = vector.z * vector2.z;

    return dest;
  }

  public static quotient(vector: Vector3, vector2: Vector3, dest: Vector3 = null): Vector3 {
    if (!dest) {
      dest = new Vector3();
    }

    dest.x = vector.x / vector2.x;
    dest.y = vector.y / vector2.y;
    dest.z = vector.z / vector2.z;

    return dest;
  }

}
