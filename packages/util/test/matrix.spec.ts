/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const expect  = require('chai').expect;
const Util    = require('../../../src/util/common');
const Matrix  = require('../../../src/util/matrix');
const mat3    = Matrix.mat3;
const Vector3 = Matrix.vec3;
const vec2    = Matrix.vec2;

describe('Matrix', function() {
  it('vec2.direction(v1, v2)', function() {
    const v1 = vec2.fromValues(0, 1);
    const v2 = vec2.fromValues(1, 0);
    const direction = vec2.direction(v1, v2);
    expect(direction < 0).to.be.true;
  });
  it('vec2.angle(v1, v2)', function() {
    const v1 = vec2.fromValues(0, 1);
    const v2 = vec2.fromValues(1, 0);
    const angle = vec2.angle(v1, v2);
    expect(Util.isNumberEqual(angle, Math.PI / 2)).to.be.true;
  });
  it('vec2.angleTo(v1, v2)', function() {
    const v1 = vec2.fromValues(0, -1);
    const v2 = vec2.fromValues(1, 0);
    expect(Util.isNumberEqual(vec2.angleTo(v1, v2), Math.PI / 2)).to.be.true;
  });
  it('vec2.angleTo(v1, v2, true)', function() {
    const v1 = vec2.fromValues(0, 1);
    const v2 = vec2.fromValues(-1, 0);
    expect(Util.isNumberEqual(vec2.angleTo(v1, v2, true), Math.PI / 2 * 3)).to.be.true;
  });

  it('mat3.translate(out, a, v)', function() {
    const m = mat3.create();
    mat3.translate(m, m, [ 30, 40 ]);
    const v = Vector3.fromValues(50, 50, 1);
    Vector3.transformMat3(v, v, m);
    expect(Util.isNumberEqual(v[0], 80)).to.be.true;
    expect(Util.isNumberEqual(v[1], 90)).to.be.true;
  });

  it('mat3.rotate(out, a, v)', function() {
    const m = mat3.create();
    mat3.rotate(m, m, Math.PI / 2);
    const v = Vector3.fromValues(100, 0, 1);
    Vector3.transformMat3(v, v, m);
    expect(Util.isNumberEqual(v[0], 0)).to.be.true;
    expect(Util.isNumberEqual(v[1], 100)).to.be.true;
  });

  it('mat3.scale(out, a, v)', function() {
    const m = mat3.create();
    mat3.scale(m, m, [ 2, 2 ]);
    const v = Vector3.fromValues(50, 50, 1);
    Vector3.transformMat3(v, v, m);
    expect(Util.isNumberEqual(v[0], 100)).to.be.true;
    expect(Util.isNumberEqual(v[1], 100)).to.be.true;
  });
});
