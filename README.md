# Sentinel

> A command-line site monitor
<img src="demo.gif">

## Installation

Sentinel requires Node.js 7.0 and above. To check your Node.js version, run `node -v`.

```console
$ git clone https://github.com/dvrylc/sentinel.git && cd sentinel
$ npm install -g
$ sentinel
```

## Usage

```
sentinel [options]

A command-line site monitor

Options:
-h, --help    Prints this help message
```

## Configuration

Sentinel relies on a config file (`config.json`) for the list of sites to monitor, as well as some user-configurable settings. 

To locate the config file, run `sentinel --help`. 

### Configuration fields

`config.json` should always be a valid JSON object. 

- `timeout (int)`: HTTP request timeout in milliseconds
- `sites (array)`: Array of absolute (`http` or `https`) URLs to monitor

## License

MIT
