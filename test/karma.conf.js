/**
 * @licence
 * Copyright (c) 2018 LinBo Len <linbolen@gradii.com>
 * Copyright (c) 2017-2018 Alipay inc.
 *
 * Use of this source code is governed by an MIT-style license.
 * See LICENSE file in the project root for full license information.
 */

const path = require('path');
const { customLaunchers, platformMap } = require('./browser-providers');

module.exports = config => {

  config.set({
    basePath: path.join(__dirname, '..'),
    frameworks: [ 'mocha' ],
    plugins: [
      // require('karma-jasmine'),
      require('karma-mocha'),
      require('karma-browserstack-launcher'),
      require('karma-sauce-launcher'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-coverage')
    ],
    files: [
      { pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: false },
      { pattern: 'node_modules/chai/chai.js', included: false, watched: false },
      { pattern: 'node_modules/lodash/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/jquery/dist/jquery.js', included: false, watched: false },
      // { pattern: 'node_modules/gl-matrix/dist/gl-matrix.js', included: false, watched: false },
      { pattern: 'node_modules/event-simulate/index.js', included: false, watched: false },
      { pattern: 'node_modules/spm-jquery/jquery.js', included: false, watched: false },
      // { pattern: 'node_modules/wolfy87-eventemitter/EventEmitter.js', included: false, watched: false },
      // { pattern: 'node_modules/d3-color/build/*.js', included: false, watched: false },
      // { pattern: 'node_modules/d3-ease/build/*.js', included: false, watched: false },
      // { pattern: 'node_modules/d3-interpolate/build/*.js', included: false, watched: false },
      // { pattern: 'node_modules/d3-timer/build/*.js', included: false, watched: false },
      { pattern: 'karma/karma-test-shim.js', included: true, watched: false },
      { pattern: 'src/**/*.js', included: false, watched: true },
      { pattern: 'test/**/*+(.js|.jpg)', included: false, watched: true }
    ],

    customLaunchers,

    preprocessors: {
      'dist/**/*.js': [ 'sourcemap' ]
    },

    reporters: [ 'dots' ],
    autoWatch: true,

    coverageReporter: {
      type: 'json-summary',
      dir: 'dist/coverage/',
      subdir: '.'
    },

    sauceLabs: {
      testName: 'material2',
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      idleTimeout: 600,
      commandTimeout: 600,
      maxDuration: 5400
    },

    browserStack: {
      project: 'material2',
      startTunnel: false,
      retryLimit: 1,
      timeout: 600,
      pollingTimeout: 20000,
      video: false
    },

    browserDisconnectTimeout: 20000,
    browserNoActivityTimeout: 240000,
    captureTimeout: 120000,
    browsers: [ 'Chrome' ],

    singleRun: true,

    browserConsoleLogOptions: {
      terminal: true,
      level: 'log'
    },

    client: {
      jasmine: {
        // TODO(jelbourn): re-enable random test order once we can de-flake existing issues.
        random: false
      }
    }
  });

  if (process.env[ 'TRAVIS' ]) {
    const buildId = `TRAVIS #${process.env.TRAVIS_BUILD_NUMBER} (${process.env.TRAVIS_BUILD_ID})`;

    if (process.env[ 'TRAVIS_PULL_REQUEST' ] === 'false' &&
      process.env[ 'MODE' ] === 'travis_required') {

      config.preprocessors[ 'dist/packages/**/!(*+(.|-)spec).js' ] = [ 'coverage' ];
      config.reporters.push('coverage');
    }

    // The MODE variable is the indicator of what row in the test matrix we're running.
    // It will look like <platform>_<target>, where platform is one of 'saucelabs', 'browserstack'
    // or 'travis'. The target is a reference to different collections of browsers that can run
    // in the previously specified platform.
    const [ platform, target ] = process.env.MODE.split('_');

    if (platform === 'saucelabs') {
      config.sauceLabs.build = buildId;
      config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_ID;
    } else if (platform === 'browserstack') {
      config.browserStack.build = buildId;
      config.browserStack.tunnelIdentifier = process.env.TRAVIS_JOB_ID;
    } else if (platform !== 'travis') {
      throw new Error(`Platform "${platform}" unknown, but Travis specified. Exiting.`);
    }

    config.browsers = platformMap[ platform ][ target.toLowerCase() ];
  }
};
