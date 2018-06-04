import {Matrix3} from "./matrix3";
import {Matrix4} from "./matrix4";
/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */
import {Vector3} from "./vector3";

export class Obb3 {
  private _center: Vector3;
  private _halfExtents: Vector3;
  private _axis0: Vector3;
  private _axis1: Vector3;
  private _axis2: Vector3;

  public get center() {
    return this._center;
  }

  public get halfExtents() {
    return this._halfExtents;
  }

  public get axis0() {
    return this._axis0;
  }

  public get axis1() {
    return this._axis1;
  }

  public get axis2() {
    return this._axis2;
  }

  constructor();
  constructor(center: Vector3, halfExtents: Vector3,
              axis0: Vector3, axis1: Vector3, axis2: Vector3);
  constructor() {
    if (arguments.length === 5) {
      this._center      = arguments[0];
      this._halfExtents = arguments[1];
      this._axis0       = arguments[2];
      this._axis1       = arguments[3];
      this._axis2       = arguments[4];
    } else {
      this._center      = Vector3.zero();
      this._halfExtents = Vector3.zero();
      this._axis0       = new Vector3(1, 0, 0);
      this._axis1       = new Vector3(0, 1, 0);
      this._axis2       = new Vector3(0, 0, 1);
    }
  }

  public copyFrom(other: Obb3) {
    this._center.setFrom(other._center);
    this._halfExtents.setFrom(other._halfExtents);
    this._axis0.setFrom(other._axis0);
    this._axis1.setFrom(other._axis1);
    this._axis2.setFrom(other._axis2);

    return this;
  }

  public copy(other?: Obb3) {
    if (!other) {
      return new Obb3(this._center, this._halfExtents, this._axis0, this._axis1, this._axis2);
    }

    other._center.setFrom(this._center);
    other._halfExtents.setFrom(this._halfExtents);
    other._axis0.setFrom(this._axis0);
    other._axis1.setFrom(this._axis1);
    other._axis2.setFrom(this._axis2);

    return other;
  }

  public resetRotation() {
    this._axis0.setValues(1.0, 0.0, 0.0);
    this._axis1.setValues(0.0, 1.0, 0.0);
    this._axis2.setValues(0.0, 0.0, 1.0);

    return this;
  }

  public translate(offset: Vector3) {
    this._center.add(offset);

    return this;
  }

  public rotate(m: Matrix3) {
    m.transformVector3(this._axis0.scale(this._halfExtents.x)).normalize();
    m.transformVector3(this._axis1.scale(this._halfExtents.y)).normalize();
    m.transformVector3(this._axis2.scale(this._halfExtents.z)).normalize();

    this._halfExtents.setValues(
      this._axis0.length(),
      this._axis1.length(),
      this._axis2.length()
    );

    return this;
  }

  public transform(m: Matrix4) {
    m.transform3(this._center)
    m.rotate3(this._axis0.scale(this._halfExtents.x)).normalize();
    m.rotate3(this._axis1.scale(this._halfExtents.y)).normalize();
    m.rotate3(this._axis2.scale(this._halfExtents.z)).normalize();

    this._halfExtents.setValues(
      this._axis0.length(),
      this._axis1.length(),
      this._axis2.length()
    );

    return this;
  }

}
