/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Vector3} from "./vector3";

export class Aabb3 {

  public get min() {
    return this._min;
  }

  public get max() {
    return this._max;
  }

  constructor(private _min: Vector3, private _max: Vector3) {
  }

  public setCenterAndHalfExtents(center: Vector3, halfExtents: Vector3) {
    this._min
      .setFrom(center)
      .sub(halfExtents);

    this._max
      .setFrom(center)
      .add(halfExtents);

    return this;
  }

  public intersectsWithAabb3(other: Aabb3) {
    const otherMax = other._max;
    const otherMin = other._min;

    return (this._min.x <= otherMax.x) &&
      (this._min.y <= otherMax.y) &&
      (this._min.z <= otherMax.z) &&
      (this._max.x >= otherMin.x) &&
      (this._max.y >= otherMin.y) &&
      (this._max.z >= otherMin.z);
  }

  intersectsWithSphere(other: Sphere) {
    const center = other._center;
    const radius = other._radius;
    let d        = 0.0;
    let e        = 0.0;

    for (let i = 0; i < 3; ++i) {
      if ((e = center[i] - this._min[i]) < 0.0) {
        if (e < -radius) {
          return false;
        }

        d = d + e * e;
      } else {
        if ((e = center[i] - this._max[i]) > 0.0) {
          if (e > radius) {
            return false;
          }

          d = d + e * e;
        }
      }
    }

    return d <= radius * radius;
  }

  public intersectsWithVector3(other: Vector3) {
    return (this._min.x <= other.x) &&
      (this._min.y <= other.y) &&
      (this._min.z <= other.z) &&
      (this._max.x >= other.x) &&
      (this._max.y >= other.y) &&
      (this._max.z >= other.z);
  }

  // calculate with temp value, reduce memory;
  private static _aabbCenter           = new Vector3();
  private static _aabbHalfExtents      = new Vector3();
  private static _v0: Vector3          = new Vector3.zero();
  private static _v1: Vector3          = new Vector3.zero();
  private static _v2: Vector3          = new Vector3.zero();
  private static _f0: Vector3          = new Vector3.zero();
  private static _f1: Vector3          = new Vector3.zero();
  private static _f2: Vector3          = new Vector3.zero();
  private static _trianglePlane: Plane = new Plane();

  private static _u0: Vector3 = new Vector3([1.0, 0.0, 0.0]);
  private static _u1: Vector3 = new Vector3([0.0, 1.0, 0.0]);
  private static _u2: Vector3 = new Vector3([0.0, 0.0, 1.0]);

  intersectsWithTriangle(other: Triangle, epsilon: 1e-3, result: IntersectionResult) {
    let p0, p1, p2, r, len;
    let a;
    const _aabbCenter    = Aabb3._aabbCenter,
        _aabbHalfExtents = Aabb3._aabbHalfExtents,
        _v0              = Aabb3._v0,
        _v1              = Aabb3._v1,
        _v2              = Aabb3._v2,
        _f0              = Aabb3._f0,
        _f1              = Aabb3._f1,
        _f2              = Aabb3._f2,
        _trianglePlane   = Aabb3._trianglePlane,
        _u0              = Aabb3._u0,
        _u1              = Aabb3._u1,
        _u2              = Aabb3._u2;

    // This line isn't required if we are using center and half extents to
    // define a aabb
    this.copyCenterAndHalfExtents(Aabb3._aabbCenter, Aabb3._aabbHalfExtents);

    // Translate triangle as conceptually moving AABB to origin
    _v0
      .setFrom(other.point0)
      .sub(_aabbCenter);
    _v1
      .setFrom(other.point1)
      .sub(_aabbCenter);
    _v2
      .setFrom(other.point2)
      .sub(_aabbCenter);

    // Translate triangle as conceptually moving AABB to origin
    _f0
      .setFrom(_v1)
      .sub(_v0);
    _f1
      .setFrom(_v2)
      .sub(_v1);
    _f2
      .setFrom(_v0)
      .sub(_v2);

    // Test axes a00..a22 (category 3)
    // Test axis a00
    len = _f0.y * _f0.y + _f0.z * _f0.z;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.z * _f0.y - _v0.y * _f0.z;
      p2 = _v2.z * _f0.y - _v2.y * _f0.z;
      r  = _aabbHalfExtents[1] * _f0.z.abs() + _aabbHalfExtents[2] * _f0.y.abs();
      if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p2) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u0.crossInto(_f0, result.axis);
      }
    }

    // Test axis a01
    len = _f1.y * _f1.y + _f1.z * _f1.z;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.z * _f1.y - _v0.y * _f1.z;
      p1 = _v1.z * _f1.y - _v1.y * _f1.z;
      r  = _aabbHalfExtents[1] * _f1.z.abs() + _aabbHalfExtents[2] * _f1.y.abs();
      if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p1) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u0.crossInto(_f1, result.axis);
      }
    }

    // Test axis a02
    len = _f2.y * _f2.y + _f2.z * _f2.z;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.z * _f2.y - _v0.y * _f2.z;
      p1 = _v1.z * _f2.y - _v1.y * _f2.z;
      r  = _aabbHalfExtents[1] * _f2.z.abs() + _aabbHalfExtents[2] * _f2.y.abs();
      if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p1) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u0.crossInto(_f2, result.axis);
      }
    }

    // Test axis a10
    len = _f0.x * _f0.x + _f0.z * _f0.z;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.x * _f0.z - _v0.z * _f0.x;
      p2 = _v2.x * _f0.z - _v2.z * _f0.x;
      r  = _aabbHalfExtents[0] * _f0.z.abs() + _aabbHalfExtents[2] * _f0.x.abs();
      if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p2) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u1.crossInto(_f0, result.axis);
      }
    }

    // Test axis a11
    len = _f1.x * _f1.x + _f1.z * _f1.z;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.x * _f1.z - _v0.z * _f1.x;
      p1 = _v1.x * _f1.z - _v1.z * _f1.x;
      r  = _aabbHalfExtents[0] * _f1.z.abs() + _aabbHalfExtents[2] * _f1.x.abs();
      if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p1) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u1.crossInto(_f1, result.axis);
      }
    }

    // Test axis a12
    len = _f2.x * _f2.x + _f2.z * _f2.z;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.x * _f2.z - _v0.z * _f2.x;
      p1 = _v1.x * _f2.z - _v1.z * _f2.x;
      r  = _aabbHalfExtents[0] * _f2.z.abs() + _aabbHalfExtents[2] * _f2.x.abs();
      if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p1) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u1.crossInto(_f2, result.axis);
      }
    }

    // Test axis a20
    len = _f0.x * _f0.x + _f0.y * _f0.y;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.y * _f0.x - _v0.x * _f0.y;
      p2 = _v2.y * _f0.x - _v2.x * _f0.y;
      r  = _aabbHalfExtents[0] * _f0.y.abs() + _aabbHalfExtents[1] * _f0.x.abs();
      if (Math.max(-Math.max(p0, p2), Math.min(p0, p2)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p2) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u2.crossInto(_f0, result.axis);
      }
    }

    // Test axis a21
    len = _f1.x * _f1.x + _f1.y * _f1.y;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.y * _f1.x - _v0.x * _f1.y;
      p1 = _v1.y * _f1.x - _v1.x * _f1.y;
      r  = _aabbHalfExtents[0] * _f1.y.abs() + _aabbHalfExtents[1] * _f1.x.abs();
      if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p1) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u2.crossInto(_f1, result.axis);
      }
    }

    // Test axis a22
    len = _f2.x * _f2.x + _f2.y * _f2.y;
    if (len > epsilon) {
      // Ignore tests on degenerate axes.
      p0 = _v0.y * _f2.x - _v0.x * _f2.y;
      p1 = _v1.y * _f2.x - _v1.x * _f2.y;
      r  = _aabbHalfExtents[0] * _f2.y.abs() + _aabbHalfExtents[1] * _f2.x.abs();
      if (Math.max(-Math.max(p0, p1), Math.min(p0, p1)) > r + epsilon) {
        return false; // Axis is a separating axis
      }

      a = Math.min(p0, p1) - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        _u2.crossInto(_f2, result.axis);
      }
    }

    // Test the three axes corresponding to the face normals of AABB b (category 1). // Exit if...
    // ... [-e0, e0] and [min(v0.x,v1.x,v2.x), max(v0.x,v1.x,v2.x)] do not overlap
    if (Math.max(_v0.x, Math.max(_v1.x, _v2.x)) < -_aabbHalfExtents[0] ||
      Math.min(_v0.x, Math.min(_v1.x, _v2.x)) > _aabbHalfExtents[0]) {
      return false;
    }
    a = Math.min(_v0.x, Math.min(_v1.x, _v2.x)) - _aabbHalfExtents[0];
    if (result != null && (result._depth == null || result._depth < a)) {
      result._depth = a;
      result.axis.setFrom(_u0);
    }
    // ... [-e1, e1] and [min(v0.y,v1.y,v2.y), max(v0.y,v1.y,v2.y)] do not overlap
    if (Math.max(_v0.y, Math.max(_v1.y, _v2.y)) < -_aabbHalfExtents[1] ||
      Math.min(_v0.y, Math.min(_v1.y, _v2.y)) > _aabbHalfExtents[1]) {
      return false;
    }
    a = Math.min(_v0.y, Math.min(_v1.y, _v2.y)) - _aabbHalfExtents[1];
    if (result != null && (result._depth == null || result._depth < a)) {
      result._depth = a;
      result.axis.setFrom(_u1);
    }
    // ... [-e2, e2] and [min(v0.z,v1.z,v2.z), max(v0.z,v1.z,v2.z)] do not overlap
    if (Math.max(_v0.z, Math.max(_v1.z, _v2.z)) < -_aabbHalfExtents[2] ||
      Math.min(_v0.z, Math.min(_v1.z, _v2.z)) > _aabbHalfExtents[2]) {
      return false;
    }
    a = Math.min(_v0.z, Math.min(_v1.z, _v2.z)) - _aabbHalfExtents[2];
    if (result != null && (result._depth == null || result._depth < a)) {
      result._depth = a;
      result.axis.setFrom(_u2);
    }

    // It seems like that wee need to move the edges before creating the
    // plane
    _v0.add(_aabbCenter);

    // Test separating axis corresponding to triangle face normal (category 2)
    _f0.crossInto(_f1, _trianglePlane.normal);
    _trianglePlane.constant = _trianglePlane.normal.dot(_v0);
    return intersectsWithPlane(_trianglePlane, result:result);
  }

  public intersectsWithPlane(other: Plane, result: IntersectionResult) {
    // This line is not necessary with a (center, extents) AABB representation
    this.copyCenterAndHalfExtents(Aabb3._aabbCenter, Aabb3._aabbHalfExtents);

    // Compute the projection interval radius of b onto L(t) = b.c + t * p.n
    const r = Aabb3._aabbHalfExtents[0] * other.normal[0].abs() +
      Aabb3._aabbHalfExtents[1] * other.normal[1].abs() +
      Aabb3._aabbHalfExtents[2] * other.normal[2].abs();
    // Compute distance of box center from plane
    const s = other.normal.dot(Aabb3._aabbCenter) - other.constant;
    // Intersection occurs when distance s falls within [-r,+r] interval
    if (s.abs() <= r) {
      const a = s - r;
      if (result != null && (result._depth == null || result._depth < a)) {
        result._depth = a;
        result.axis.setFrom(other.normal);
      }
      return true;
    }

    return false;
  }
}
