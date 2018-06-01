/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {color} from 'd3-color';
import {interpolateArray} from './array';
import {interpolateConstant} from './constant';
import {interpolateDate} from './date';
import {interpolateNumber} from './number';
import {interpolateObject} from './object';
import {interpolateRgb} from './rgb';
import {interpolateString} from './string';

export function interpolateValue(a, b) {
  let t = typeof b, c;
  return b == null || t === 'boolean' ? interpolateConstant(b)
      : (t === 'number' ? interpolateNumber
      : t === 'string' ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
      : b instanceof color ? interpolateRgb
      : b instanceof Date ? interpolateDate
      : Array.isArray(b) ? interpolateArray
      : typeof b.valueOf !== 'function' && typeof b.toString !== 'function' || isNaN(b) ? interpolateObject
      : interpolateNumber)(a, b);
}
