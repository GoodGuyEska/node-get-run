#!/usr/bin/env node
'use strict';

const nodeGetRun = require('./');
const pkg = require('./package.json');
//const isOnline = require('is-online');

//const os = process.platform  === 'win32' ? 'win' : process.platform;
const args = process.argv.slice(2);

// Check for version to install.
const options = ['nightly', 'release', 'version'];
let ix = -1;      // index of the option chosen

for (let i = 0; i < options.length; i++) {
  const index = args.findIndex(arg => arg.indexOf(`--${options[i]}`) === 0);
  if (index >= 0) {
    if (ix >= 0) {
      throw new TypeError(`can only specify one: ${options.join(', ')}`);
    }
    ix = index;
  }
}

let p;

if (ix >= 0) {
  // allow either --version <version> or --version=<version>
  const option = args[ix].split('=');

  const type = option[0].slice(2);
  let version;
  let removeCount;

  if (option.length === 1) {
    version = args[ix + 1];
    removeCount = 2;
  } else if (option.length === 2) {
    version = option[1];
    removeCount = 1;
  } else if (option.length > 2) {
    throw new TypeError(`invalid option: ${args[ix]}`);
  }

  args.splice(ix, removeCount);
  p = nodeGetRun.install(type, version);
} else {
  // no installation requested so just run what's there.
  let status = 0;
  const cp = nodeGetRun.run(args);
  if (cp.error) {
    status = 1;

    if (cp.error.errno === 'ENOENT') {
      /* eslint-disable no-console */
      console.error(`${pkg.name} has not installed a version of node in this directory`);
      console.error('please use either --nightly, --release, or --version to install one');
      /* eslint-enable no-console */
    }
  }
  process.exit(status);
}

/* eslint-disable no-console */
p.then(console.log)
  .catch(console.error);
/* eslint-enable no-console */

//if (version) {
//  nodeNightly.install(version).catch(console.error);
//}
//else if (!!~upgradeIndex) {
//  reportIfOffline();
//  nodeNightly.update().then(res => {
//    if (res !== 'Installed') {
//      console.log(res);
//    }
//    process.exit(0);
//  }).catch(console.error);
//} else if (!existsSync(`${__dirname}/node-nightly`)) {
//
//  console.log('Downloading the nightly version, hang on...');
//  reportIfOffline();
//  //First install
//  nodeNightly.install().catch(console.error);
//} else {
//
//  nodeNightly.check().then(updatedVersion => {
//    if (updatedVersion) {
//      console.log('\x1b[36m', 'New nightly available. To upgrade: `node-nightly --upgrade`', '\x1b[0m');
//    }
//    if (os === 'win') {
//      spawn(`${__dirname}/node-nightly/node`, args, {stdio: 'inherit', env: process.env});
//    } else {
//      spawn(`${__dirname}/node-nightly/bin/node`, args, {stdio: 'inherit', env: process.env});
//    }
//  }).catch(console.error);
//}
//
//function reportIfOffline () {
//  isOnline((err, online) => {
//    if (!online) {
//      //offline
//      console.info('\x1b[31m', 'Please check your internet connectivity.', '\x1b[0m');
//      process.exit(0);
//    }
//  });
//}
