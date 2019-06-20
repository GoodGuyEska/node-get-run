# node-get-run

`node-get-run` installs specific versions of node, either nightlies or released versions, in a local folder.

## Install

```
$ npm install --global node-get-run
```


## Usage

__For the first time:__

```sh
$ node-get-run --release v12.0.1
{status: installed}
```

And then just use `node-get-run` as if it were `node`:

```sh
$ node-get-run --inspect --debug-brk index.js
```

or

```sh
$ node-get-run index.js
```

## Installation options

 1. `node-get-run --nightly {version}` Install a specific nightly, e.g., `v12.0.0-nightly20181024bb79e768e5`
 2. `node-get-run --release {version}` Install a specific version, e.g., `v12.0.0`
 2. ~~`node-get-run --upgrade` Install the latest nightly~~ (tbd)
 2. ~~`node-get-run --clean` Delete the currently installed version~~ (tbd)


## License

MIT © [Hemanth.HM](https://h3manth.com)
