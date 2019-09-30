'use strict';

const axios = require('axios');

//const osArch = `${process.platform}-${process.arch}`;
//const osVerMap = {
//  'win32-x64':'win-x64-msi',
//  'win32-ia32':'win-x86-msi',
//  'darwin-x64':'osx-x64-pkg',
//  'darwin-ia32':'osx-x86-tar',
//  'linux-x64':'linux-x64',
//  'linux-ia32':'linux-x86',
//  'sunos-x64':'sunos-x64',
//  'sunos-ia32':'sunos-x86'
//}
//
//function latestNightly () {
//  return getNightlies()
//    .then(versions => (versions[osArch] || versions[osVerMap[osArch]]).version);
//}
//
//const files = [
//  "headers",
//  "linux-x64",
//  "linux-x86",
//  "osx-x64-pkg",
//  "osx-x64-tar",
//  "osx-x86-tar",
//  "src",
//  "sunos-x64",
//  "sunos-x86",
//  "win-x64-msi",
//  "win-x86-msi",
//];
//
const platformArchMap = {
  'win32-x64': 'win-x64-msi',
  'win32-ia32': 'win-x86-msi',
  'darwin-x64': 'osx-x64-pkg',
  'darwin-ia32': 'osx-x86-tar',
  'linux-x64': 'linux-x64',
  'linux-ia32': 'linux-x86',
  'sunos-x64': 'sunos-x64',
  'sunos-ia32': 'sunos-x86'
}


class Nightlies {
  constructor (options = {}) {
    this.where = options.mirror || 'https://nodejs.org';
    this.url = `${this.where}/download/nightly/index.json`;
  }

  getNightlies (options = {}) {
    return axios.get(this.url)
      .then(r => {
        if (r.status === 200) {
          return r.data;
        }
        return [];
      })
  }

  getLatestNightly (options = {}) {
    const pa = `${options.platform || process.platform}-${options.arch || process.arch}`;
    const nightlyFile = platformArchMap[pa] || pa;

    let p;
    if (options.nightlies) {
      p = Promise.resolve(options.nightlies)
    } else {
      p = this.getNightlies();
    }

    return p.then(nightlies => {
      for (let i = 0; i < nightlies.length; i++) {
        if (nightlies[i].files.indexOf(nightlyFile) >= 0) {
          return nightlies[i].version;
        }
      }
      return undefined;

    })
  }
}


module.exports = {
  Nightlies
}
