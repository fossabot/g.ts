/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const expect = require('chai').expect;
const G = require('../../src/index');

describe('index', () => {
  it('G', () => {
    expect('G').to.be.a('string');
    expect(G).to.be.a('object');
  });
});
