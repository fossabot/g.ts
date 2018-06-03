/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Matrix4} from './matrix4';

export class Vector4 {
  public static zero = new Vector4([0, 0, 0, 1]);

  private values = new Float32Array(4);

  get x(): number {
    return this.values[0];
  }

  get y(): number {
    return this.values[1];
  }

  get z(): number {
    return this.values[2];
  }

  get w(): number {
    return this.values[3];
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

  get xyzw(): number[] {
    return [
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
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

  set w(value: number) {
    this.values[3] = value;
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

  set xyzw(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
    this.values[2] = values[2];
    this.values[3] = values[3];
  }

  get r(): number {
    return this.values[0];
  }

  get g(): number {
    return this.values[1];
  }

  get b(): number {
    return this.values[2];
  }

  get a(): number {
    return this.values[3];
  }

  get rg(): number[] {
    return [
      this.values[0],
      this.values[1],
    ];
  }

  get rgb(): number[] {
    return [
      this.values[0],
      this.values[1],
      this.values[2],
    ];
  }

  get rgba(): number[] {
    return [
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
    ];
  }

  set r(value: number) {
    this.values[0] = value;
  }

  set g(value: number) {
    this.values[1] = value;
  }

  set b(value: number) {
    this.values[2] = value;
  }

  set a(value: number) {
    this.values[3] = value;
  }

  set rg(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
  }

  set rgb(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
    this.values[2] = values[2];
  }

  set rgba(values: number[]) {
    this.values[0] = values[0];
    this.values[1] = values[1];
    this.values[2] = values[2];
    this.values[3] = values[3];
  }

  constructor(values?: number[]);
  constructor(arg0: number, arg1: number, arg2: number, arg3: number);
  constructor() {
    if (arguments.length === 1) {
      if (arguments[0]) {
        this.xyzw = arguments[0];
      }
    } else if (arguments.length === 4) {
      this.values[0] = arguments[0];
      this.values[1] = arguments[1];
      this.values[2] = arguments[2];
      this.values[3] = arguments[3];
    } else {
      this.values[0] = 0;
      this.values[1] = 0;
      this.values[2] = 0;
      this.values[3] = 0;
    }
  }

  public at(index: number): number {
    return this.values[index];
  }

  public reset(): void {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.w = 0;
  }

  public copy(dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = new Vector4();
    }

    dest.x = this.x;
    dest.y = this.y;
    dest.z = this.z;
    dest.w = this.w;

    return dest;
  }

  public negate(dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = this;
    }

    dest.x = -this.x;
    dest.y = -this.y;
    dest.z = -this.z;
    dest.w = -this.w;

    return dest;
  }

  public equals(vector: Vector4, threshold = EPSILON): boolean {
    if (Math.abs(this.x - vector.x) > threshold) {
      return false;
    }

    if (Math.abs(this.y - vector.y) > threshold) {
      return false;
    }

    if (Math.abs(this.z - vector.z) > threshold) {
      return false;
    }

    if (Math.abs(this.w - vector.w) > threshold) {
      return false;
    }

    return true;
  }

  public length(): number {
    return Math.sqrt(this.squaredLength());
  }

  public squaredLength(): number {
    const x = this.x,
          y = this.y,
          z = this.z,
          w = this.w;

    return (x * x + y * y + z * z + w * w);
  }

  public add(vector: Vector4): Vector4 {
    this.x += vector.x;
    this.y += vector.y;
    this.z += vector.z;
    this.w += vector.w;

    return this;
  }

  public subtract(vector: Vector4): Vector4 {
    this.x -= vector.x;
    this.y -= vector.y;
    this.z -= vector.z;
    this.w -= vector.w;

    return this;
  }

  // tslint:disable-next-line
  public sub = this.subtract.bind(this);

  public multiply(vector: Vector4): Vector4 {
    this.x *= vector.x;
    this.y *= vector.y;
    this.z *= vector.z;
    this.w *= vector.w;

    return this;
  }

  // tslint:disable-next-line
  public mul = this.multiply.bind(this);

  public divide(vector: Vector4): Vector4 {
    this.x /= vector.x;
    this.y /= vector.y;
    this.z /= vector.z;
    this.w /= vector.w;

    return this;
  }

  // tslint:disable-next-line
  public div = this.divide.bind(this);

  public scale(value: number, dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = this;
    }

    dest.x *= value;
    dest.y *= value;
    dest.z *= value;
    dest.w *= value;

    return dest;
  }

  public normalize(dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = this;
    }

    let length = this.length();

    if (length === 1) {
      return this;
    }

    if (length === 0) {
      dest.x *= 0;
      dest.y *= 0;
      dest.z *= 0;
      dest.w *= 0;

      return dest;
    }

    length = 1.0 / length;

    dest.x *= length;
    dest.y *= length;
    dest.z *= length;
    dest.w *= length;

    return dest;
  }

  public multiplyMat4(matrix: Matrix4, out: Vector4 = null): Vector4 {
    if (!out) {
      this.copy(out);
    }

    return matrix.transform(out);
  }

  public static mix(vector: Vector4, vector2: Vector4, time: number, dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = new Vector4();
    }

    dest.x = vector.x + time * (vector2.x - vector.x);
    dest.y = vector.y + time * (vector2.y - vector.y);
    dest.z = vector.z + time * (vector2.z - vector.z);
    dest.w = vector.w + time * (vector2.w - vector.w);

    return dest;
  }

  public static sum(vector: Vector4, vector2: Vector4, dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = new Vector4();
    }

    dest.x = vector.x + vector2.x;
    dest.y = vector.y + vector2.y;
    dest.z = vector.z + vector2.z;
    dest.w = vector.w + vector2.w;

    return dest;
  }

  public static difference(vector: Vector4, vector2: Vector4, dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = new Vector4();
    }

    dest.x = vector.x - vector2.x;
    dest.y = vector.y - vector2.y;
    dest.z = vector.z - vector2.z;
    dest.w = vector.w - vector2.w;

    return dest;
  }

  public static product(vector: Vector4, vector2: Vector4, dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = new Vector4();
    }

    dest.x = vector.x * vector2.x;
    dest.y = vector.y * vector2.y;
    dest.z = vector.z * vector2.z;
    dest.w = vector.w * vector2.w;

    return dest;
  }

  public static quotient(vector: Vector4, vector2: Vector4, dest: Vector4 = null): Vector4 {
    if (!dest) {
      dest = new Vector4();
    }

    dest.x = vector.x / vector2.x;
    dest.y = vector.y / vector2.y;
    dest.z = vector.z / vector2.z;
    dest.w = vector.w / vector2.w;

    return dest;
  }
}
