'use strict';

const download = require('download');
//const nodeNightlyVersion = require('node-nightly-version');
const Configstore = require('configstore');
const pkg = require('./package.json');
const rimraf = require('rimraf');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

const logger = new (require('debug-custom'))('node-get-run', {defaultLevels: process.env.NGR_LOG_SETTINGS});
const log = {
  error: logger.make('error'),
  warn: logger.make('warn'),
  info: logger.make('info'),
}

const os = process.platform === 'win32' ? 'win' : process.platform;
const extension = os === 'win' ? 'zip' : 'tar.gz';
const arch = process.arch === 'ia32' ? 'x86' : process.arch;

const targetDir = `${process.cwd()}/.node-get-run`;

module.exports = {

  install: (type, version) => {
    let url = 'https://nodejs.org/download/';

    if (type === 'release' || type === 'nightly') {
      // see https://nodejs.org/download/release/ and https://nodejs.org/download/nightly/
      url += `${type}/${version}/node-${version}-${os}-${arch}.${extension}`;
    } else if (type === 'version') {
      if (version.indexOf('nightly') >= 0) {
        url += `nightly/${version}/node-${version}-${os}-${arch}.${extension}`;
      } else {
        url += `release/${version}/node-${version}-${os}-${arch}.${extension}`;
      }
    } else {
      throw new TypeError(`invalid release type "${type}"`);
    }

    const tempDir = `${process.cwd()}/node-${version}-${os}-${arch}`;


    log.info(`downloading ${url}`);

    return new Promise((resolve, reject) => {
      log.info(`deleting ${tempDir}/`);
      rimraf(tempDir, e => {
        e ? reject(e) : resolve();
      })
    })
      .then(_ => {
        log.info(`downloading ${url}`);
        return download(url, process.cwd(), {extract: true})
      })
      .then(_ => {
        return new Promise((resolve, reject) => {
          log.info(`deleting ${targetDir}/`);
          rimraf(targetDir, e => {
            e ? reject(e) : resolve();
          })
        })
      })
      .then(_ => {
        log.info(`renamed ${tempDir}/ to ${targetDir}/`)
        return new Promise((resolve, reject) => {
          fs.rename(tempDir, targetDir, e => {
            e ? reject(e) : resolve();
          })
        })
      })
      .then(_ => {
        new Configstore(pkg.name).set('version', version);
        log.info('set config store');
        return {status: 'installed'};
      });

  },

  update: function () {
    // eslint-disable-next-line no-console
    //console.log('Checking for update...');
    //return this.check().then(updatedVersion => {
    //  if (updatedVersion) {
    //    return this.install(updatedVersion);
    //  }
    //  return 'You are using latest version already.';
    //});
  },

  check: function () {
    //return nodeNightlyVersion().then(latestVersion => {
    //  const currentVersion = new Configstore(pkg.name).get('version');
    //  if (!currentVersion || compVersion(currentVersion, latestVersion)) {
    //    return latestVersion;
    //  }
    //  return false;
    //});
  },

  run: function (args) {
    const executable = os === 'win' ? `${targetDir}/node` : `${targetDir}/bin/node`;
    const cp = spawnSync(executable, args, {stdio: 'inherit', env: process.env});
    return cp;
  }
};
