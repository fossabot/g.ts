/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const Util        = require('../util/index');
const Shape       = require('../core/shape');
const PathSegment = require('./util/path-segment');
const Format      = require('../util/format');
const Arrow       = require('./util/arrow');
const PathUtil    = require('../util/path');
const CubicMath   = require('./math/cubic');

export class Path extends Shape {
  public static ATTRS = {
    path      : null,
    lineWidth : 1,
    curve     : null, // 曲线path
    tCache    : null,
    startArrow: false,
    endArrow  : false,
  };

  protected canFill   = true;
  protected canStroke = true;
  protected type      = 'path';

  constructor(cfg) {
    super(cfg);
  }

  public getDefaultAttrs() {
    return {
      lineWidth : 1,
      startArrow: false,
      endArrow  : false,
    };
  }

  public __afterSetAttrPath(path) {
    const self = this;
    if (Util.isNil(path)) {
      self.setSilent('segments', null);
      self.setSilent('box', undefined);
      return;
    }
    const pathArray = Format.parsePath(path);
    let preSegment;
    const segments  = [];

    if (!Util.isArray(pathArray) ||
      pathArray.length === 0 ||
      (pathArray[0][0] !== 'M' &&
        pathArray[0][0] !== 'm')
    ) {
      return;
    }
    const count = pathArray.length;
    for (let i = 0; i < pathArray.length; i++) {
      const item = pathArray[i];
      preSegment = new PathSegment(item, preSegment, i === count - 1);
      segments.push(preSegment);
    }
    self.setSilent('segments', segments);
    self.set('tCache', null);
    this.setSilent('box', null);
  }

  public __afterSetAttrAll(objs) {
    if (objs.path) {
      this.__afterSetAttrPath(objs.path);
    }
  }

  public calculateBox() {
    const self     = this;
    const segments = self.get('segments');

    if (!segments) {
      return null;
    }
    const lineWidth = this.getHitLineWidth();
    let minX        = Infinity;
    let maxX        = -Infinity;
    let minY        = Infinity;
    let maxY        = -Infinity;
    Util.each(segments, function(segment) {
      segment.getBBox(lineWidth);
      const box = segment.box;
      if (box) {
        if (box.minX < minX) {
          minX = box.minX;
        }

        if (box.maxX > maxX) {
          maxX = box.maxX;
        }

        if (box.minY < minY) {
          minY = box.minY;
        }

        if (box.maxY > maxY) {
          maxY = box.maxY;
        }
      }
    });
    return {
      minX,
      minY,
      maxX,
      maxY,
    };
  }

  public isPointInPath(x, y) {
    const self   = this;
    const fill   = self.hasFill();
    const stroke = self.hasStroke();

    if (fill && stroke) {
      return self.__isPointInFill(x, y) || self.__isPointInStroke(x, y);
    }

    if (fill) {
      return self.__isPointInFill(x, y);
    }

    if (stroke) {
      return self.__isPointInStroke(x, y);
    }

    return false;
  }

  public __isPointInFill(x, y) {
    const self    = this;
    const context = self.get('context');
    if (!context) { return undefined; }
    self.createPath();
    return context.isPointInPath(x, y);
  }

  public __isPointInStroke(x, y) {
    const self     = this;
    const segments = self.get('segments');
    if (!Util.isEmpty(segments)) {
      const lineWidth = self.getHitLineWidth();
      for (let i = 0, l = segments.length; i < l; i++) {
        if (segments[i].isInside(x, y, lineWidth)) {
          return true;
        }
      }
    }

    return false;
  }

  public __setTcache() {
    let totalLength = 0;
    let tempLength  = 0;
    const tCache    = [];
    let segmentT;
    let segmentL;
    let segmentN;
    let l;
    const curve     = this.curve;

    if (!curve) {
      return;
    }

    Util.each(curve, function(segment, i) {
      segmentN = curve[i + 1];
      l        = segment.length;
      if (segmentN) {
        totalLength += CubicMath.len(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
      }
    });

    Util.each(curve, function(segment, i) {
      segmentN = curve[i + 1];
      l        = segment.length;
      if (segmentN) {
        segmentT    = [];
        segmentT[0] = tempLength / totalLength;
        segmentL    = CubicMath.len(segment[l - 2], segment[l - 1], segmentN[1], segmentN[2], segmentN[3], segmentN[4], segmentN[5], segmentN[6]);
        tempLength += segmentL;
        segmentT[1] = tempLength / totalLength;
        tCache.push(segmentT);
      }
    });

    this.tCache = tCache;
  }

  public __calculateCurve() {
    const self  = this;
    const attrs = self.__attrs;
    const path  = attrs.path;
    this.curve  = PathUtil.pathTocurve(path);
  }

  public getPoint(t) {
    let tCache = this.tCache;
    let subt;
    let index;

    if (!tCache) {
      this.__calculateCurve();
      this.__setTcache();
      tCache = this.tCache;
    }

    const curve = this.curve;

    if (!tCache) {
      if (curve) {
        return {
          x: curve[0][1],
          y: curve[0][2],
        };
      }
      return null;
    }
    Util.each(tCache, function(v, i) {
      if (t >= v[0] && t <= v[1]) {
        subt  = (t - v[0]) / (v[1] - v[0]);
        index = i;
      }
    });
    const seg = curve[index];
    if (Util.isNil(seg) || Util.isNil(index)) {
      return null;
    }
    const l       = seg.length;
    const nextSeg = curve[index + 1];
    return {
      x: CubicMath.at(seg[l - 2], nextSeg[1], nextSeg[3], nextSeg[5], 1 - subt),
      y: CubicMath.at(seg[l - 1], nextSeg[2], nextSeg[4], nextSeg[6], 1 - subt),
    };
  }

  public createPath(context) {
    const self = this;
    const segments = self.get('segments');
    if (!Util.isArray(segments)) return;

    context = context || self.get('context');

    context.beginPath();
    const segmentsLen = segments.length;

    for (let i = 0; i < segmentsLen; i++) {
      segments[i].draw(context);
    }

    const self = this;
    const attrs = self.__attrs;
    const segments = self.get('segments');
    const path = attrs.path;
    let startPoint,
      endPoint,
      tangent;
    context = context || self.get('context');
    if (!Util.isArray(segments)) return;
    if (!attrs.startArrow && !attrs.endArrow) {
      return;
    }
    if (path[path.length - 1] === 'z' || path[path.length - 1] === 'Z' || attrs.fill) { // 闭合路径不绘制箭头
      return;
    }
    const segmentsLen = segments.length;
    if (segmentsLen > 1) {
      startPoint = segments[0].endPoint;
      endPoint = segments[1].endPoint;
      tangent = segments[1].startTangent;
      if (Util.isFunction(tangent)) {
        const v = tangent();
        Arrow.addStartArrow(context, attrs, startPoint.x - v[0], startPoint.y - v[1], startPoint.x, startPoint.y);
      } else {
        Arrow.addStartArrow(context, attrs, endPoint.x, endPoint.y, startPoint.x, startPoint.y);
      }
    }
    if (segmentsLen > 1) {
      startPoint = segments[ segmentsLen - 2 ].endPoint;
      endPoint = segments[ segmentsLen - 1 ].endPoint;
      tangent = segments[segmentsLen - 1].endTangent;
      if (Util.isFunction(tangent)) {
        const v = tangent();
        Arrow.addEndArrow(context, attrs, endPoint.x - v[0], endPoint.y - v[1], endPoint.x, endPoint.y, tangent());
      } else {
        Arrow.addEndArrow(context, attrs, startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      }
      }
    }
  }

}
