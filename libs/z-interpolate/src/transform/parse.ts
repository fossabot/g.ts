/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2010-2016 Mike Bostock
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {decompose, identity} from './decompose';

let cssNode,
    cssRoot,
    cssView,
    svgNode;

export function parseCss(value) {
  if (value === 'none') { return identity; }
  if (!cssNode) { cssNode = document.createElement('DIV'), cssRoot = document.documentElement, cssView = document.defaultView; }
  cssNode.style.transform = value;
  value                   = cssView.getComputedStyle(cssRoot.appendChild(cssNode), null).getPropertyValue('transform');
  cssRoot.removeChild(cssNode);
  value = value.slice(7, -1).split(',');
  return decompose(+value[0], +value[1], +value[2], +value[3], +value[4], +value[5]);
}

export function parseSvg(value) {
  if (value == null) { return identity; }
  if (!svgNode) { svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'g'); }
  svgNode.setAttribute('transform', value);
  if (!(value = svgNode.transform.baseVal.consolidate())) { return identity; }
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
