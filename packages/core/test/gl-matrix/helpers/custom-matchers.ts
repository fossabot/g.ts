/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const EPSILON = 0.00001;

beforeEach(() => {
    jasmine.addMatchers({
        toBeEqualish() {
            return {
                compare: (actual: any, expected: any) => {
                    if (typeof actual === 'number') {
                        return { pass: Math.abs(actual - expected) < EPSILON };
                    }

                    if (actual.length !== expected.length) {
                        return { pass: false };
                    }
                    for (let i = 0; i < actual.length; i++) {
                        if (isNaN(actual[i]) !== isNaN(expected[i])) {
                            return { pass: false };
                        }
                        if (Math.abs(actual[i] - expected[i]) >= EPSILON) {
                            return { pass: false };
                        }
                    }
                    return { pass: true };
                },
            };
        },
    });
});

// tslint:disable-next-line:no-namespace
declare namespace jasmine {
    // tslint:disable-next-line:interface-name
    interface Matchers<T> {
        toBeEqualish(expected: number | number[] | Float32Array): boolean;
    }
}
