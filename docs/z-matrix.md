take a note about gl-matrix.

- [x] gl-matrix is more about c style.
- [x] gl-matrix code quality is good.
- [x] full of function.
- [x] the weakness.  must pass in `out` parameter.
- [x] need rethink about introduce gl-matrix


Conclusion:
- use gl-matrix as base api
- not complete use gl-matrix pure function style api, move some to non static
- change function parameter sign. ~~move `out` parameter to latest. and if not set `out`, then the out is `this`~~, remove `out`, default use `this`. if want to use a new one, use `clone` first
- class Type T, function return Type T. then can trans into no static
- lack of matrix2
- lack of some api
- because gl-matrix is pure function. so some of api should convert to class or static. 
it is hard to choice which api should be non static or static. `NEVER MIND`


### Schedule Board

status marker `✔` `✘`

|  Class  | Status | Description |      |
| :-----: | :----: | :---------: | ---- |
| Matrix2 |   ✔    |             |      |
| Matrix3 |   ✘    |             |      |
| Matrix4 |   ✘    |             |      |
| Vector2 |   ✘    |             |      |
| Vector3 |   ✘    |             |      |



### reference

[euclideanspace](https://www.euclideanspace.com/maths/algebra/index.htm)
