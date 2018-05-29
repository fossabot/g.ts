/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

import {Arc} from '../math/arc';
import {Cubic} from '../math/cubic';
import {Line} from '../math/line';
import {Quadratic} from '../math/quadratic';

export class Inside {
  public static line(x1, y1, x2, y2, lineWidth, x, y) {
    const box = Line.box(x1, y1, x2, y2, lineWidth);

    if (!this.box(box.minX, box.maxX, box.minY, box.maxY, x, y)) {
      return false;
    }

    const d = Line.pointDistance(x1, y1, x2, y2, x, y);
    if (isNaN(d)) {
      return false;
    }
    return d <= lineWidth / 2;
  }

  public static polyline(points, lineWidth, x, y) {
    const l = points.length - 1;
    if (l < 1) {
      return false;
    }
    for (let i = 0; i < l; i++) {
      const x1 = points[i][0];
      const y1 = points[i][1];
      const x2 = points[i + 1][0];
      const y2 = points[i + 1][1];

      if (this.line(x1, y1, x2, y2, lineWidth, x, y)) {
        return true;
      }
    }

    return false;
  }

  public static cubicline(x1, y1, x2, y2, x3, y3, x4, y4, lineWidth, x, y) {
    return Cubic.pointDistance(x1, y1, x2, y2, x3, y3, x4, y4, x, y) <= lineWidth / 2;
  }

  public static quadraticline(x1, y1, x2, y2, x3, y3, lineWidth, x, y) {
    return Quadratic.pointDistance(x1, y1, x2, y2, x3, y3, x, y) <= lineWidth / 2;
  }

  public static arcline(cx, cy, r, startAngle, endAngle, clockwise, lineWidth, x, y) {
    return Arc.pointDistance(cx, cy, r, startAngle, endAngle, clockwise, x, y) <= lineWidth / 2;
  }

  public static rect(rx, ry, width, height, x, y) {
    return rx <= x && x <= rx + width && ry <= y && y <= ry + height;
  }

  public static circle(cx, cy, r, x, y) {
    return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2;
  }

  public static box(minX, maxX, minY, maxY, x, y) {
    return minX <= x && x <= maxX && minY <= y && y <= maxY;
  }
}
