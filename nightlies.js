'use strict';
const fetch = require('isomorphic-fetch');
const osArch = `${process.platform}-${process.arch}`;
const osVerMap = {
  'win32-x64':'win-x64-msi',
  'win32-ia32':'win-x86-msi',
  'darwin-x64':'osx-x64-pkg',//darwin is os name for osx
  'darwin-ia32':'osx-x86-tar',
  'linux-x64':'linux-x64',
  'linux-ia32':'linux-x86',
  'sunos-x64':'sunos-x64',
  'sunos-ia32':'sunos-x86'
}

function latestNightly () {
	return getNightlies()
		.then(versions => (versions[osArch] || versions[osVerMap[osArch]]).version);
}

const files = [
	"headers",
	"linux-x64",
	"linux-x86",
	"osx-x64-pkg",
	"osx-x64-tar",
	"osx-x86-tar",
	"src",
	"sunos-x64",
	"sunos-x86",
	"win-x64-msi",
	"win-x86-msi",
];

function getNightlies (options) {
	const nodeURL = options.mirror || 'https://nodejs.org';
	const nightlyURL = `${nodeURL}/download/nightly/index.json`;

	return fetch(nightlyURL)
		.then(resp => resp.json())
		.then(releases => files.reduce((latestVersion, file) => {
			latestVersion[file] = releases.filter(release => release.files.indexOf(file) !== -1)[0];
			return latestVersion;
		}, {}));
}

module.exports = {
	latestNightly,
	getNightlies,
}
