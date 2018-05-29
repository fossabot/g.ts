/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const PRECISION = 0.00001; // 常量，据的精度，小于这个精度认为是0

export const isFunction = require('lodash/isFunction');
export const isObject   = require('lodash/isObject');
export const isBoolean  = require('lodash/isBoolean');
export const isNil      = require('lodash/isNil');
export const isString   = require('lodash/isString');
export const isArray    = require('lodash/isArray');
export const isNumber   = require('lodash/isNumber');
export const isEmpty    = require('lodash/isEmpty'); // isBlank
export const uniqueId   = require('lodash/uniqueId');
export const clone      = require('lodash/clone');
export const merge      = require('lodash/merge'); // mix
export const upperFirst = require('lodash/upperFirst'); // ucfirst
export const remove     = require('lodash/pull');
export const isEqual    = require('lodash/isEqual');
export const toArray    = require('lodash/toArray');

/**
 * 判断两个数是否相等
 * @param {Number} a 数
 * @param {Number} b 数
 * @return {Boolean} 是否相等
 **/
export function isNumberEqual(a, b) {
  return Math.abs((a - b)) < PRECISION;
}
