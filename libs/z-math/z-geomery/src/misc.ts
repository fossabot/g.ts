/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const RADIAN    = Math.PI / 180;
const DEGREE    = 180 / Math.PI;

/**
 * 获取角度对应的弧度
 * @param {Number} degree 角度
 * @return {Number} 弧度
 **/
export function toRadian(degree) {
  return RADIAN * degree;
}

/**
 * 获取弧度对应的角度
 * @param {Number} radian 弧度
 * @return {Number} 角度
 **/
export function toDegree(radian) {
  return DEGREE * radian;
}

/**
 * 广义取模运算
 * @param {Number} n 被取模的值
 * @param {Number} m 模
 * @return {Number} 返回n 被 m 取模的结果
 */
export function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * 把a夹在min，max中间, 低于min的返回min，高于max的返回max，否则返回自身
 * @param {Number} a 数
 * @param {Number} min 下限
 * @param {Number} max 上限
 * @return {Number} 返回结果值
 **/
export function clamp(a, min, max) {
  if (a < min) {
    return min;
  } else if (a > max) {
    return max;
  }

  return a;
}
