/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

// Prevent Karma from starting synchronously
// by overriding the default handler.
__karma__.loaded = function() {
};


// SystemJS configuration.
System.config({
  baseURL: '/base',
  warnings: true,
  paths: {
    'node:': 'node_modules/'
  },
  map: {
    chai: 'node:chai/chai.js',
    lodash: 'node:lodash',
    jquery: 'node:jquery/dist/jquery.js',
    'gl-matrix': 'node:gl-matrix',
    'event-simulate': 'node:event-simulate/index.js',
    'wolfy87-eventemitter': 'node:wolfy87-eventemitter/EventEmitter.js',
    'spm-jquery': 'node:spm-jquery/jquery.js',
    'd3-color': 'node:d3-color/build/d3-color.js',
    'd3-ease': 'node:d3-ease/build/d3-ease.js',
    'd3-interpolate': 'node:d3-interpolate/build/d3-interpolate.js',
    'd3-timer': 'node:d3-timer/build/d3-timer.js'
  },
  packages: {
    lodash: { main: 'index' },
    'gl-matrix': { main: 'dist/gl-matrix' },
    // Set the default extension for the root package, because otherwise the demo-app can't
    // be built within the production mode. Due to missing file extensions.
    '.': {
      defaultExtension: 'js'
    }
  }
});


// Load test files, then start Karma.
Promise
  .all(loadTestFiles())
  .then(
    function() {
      __karma__.start();
    },
    function(error) {
      console.error(error.stack || error);
      __karma__.start();
    }
  );


/**
 * @param {string} path
 * @returns {boolean}
 */
function filterTestFiles(path) {
  return /\.spec\.js$/.test(path);
}


/**
 * @param {string} path
 * @returns {Promise}
 */
function importTestFiles(path) {
  return System.import(path);
}


/**
 * @returns {Promise[]}
 */
function loadTestFiles() {
  return Object
    .keys(window.__karma__.files)
    .filter(filterTestFiles)
    .map(importTestFiles);
}
