/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {interpolateConstant} from './constant';

function interpolateLinear(a, d) {
  return function(t) {
    return a + t * d;
  };
}

function interpolateExponential(a, b, y) {
  return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
    return Math.pow(a + t * b, y);
  };
}

export function interpolateHue(a, b) {
  const d = b - a;
  return d ? interpolateLinear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : interpolateConstant(isNaN(a) ? b : a);
}

export function gamma(y) {
  return (y = +y) === 1 ? noGamma : function(a, b) {
    return b - a ? interpolateExponential(a, b, y) : interpolateConstant(isNaN(a) ? b : a);
  };
}

export function noGamma(a, b) {
  const d = b - a;
  return d ? interpolateLinear(a, d) : interpolateConstant(isNaN(a) ? b : a);
}

export const interpolateColor = noGamma;
