/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import mat3 from 'gl-matrix/src/gl-matrix/mat3';
import vec2 from 'gl-matrix/src/gl-matrix/vec2';
import vec3 from 'gl-matrix/src/gl-matrix/Vector3';
import CommonUtil from './common';

export default {
  mat3,
  vec2,
  vec3,
  transform(m, ts) {
    m = CommonUtil.clone(m);
    CommonUtil.each(ts, (t) => {
      switch (t[0]) {
        case 't':
          mat3.translate(m, m, [ t[1], t[2] ]);
          break;
        case 's':
          mat3.scale(m, m, [ t[1], t[2] ]);
          break;
        case 'r':
          mat3.rotate(m, m, t[1]);
          break;
        case 'm':
          mat3.multiply(m, m, t[1]);
          break;
        default:
          return false;
      }
    });
    return m;
  },
};
