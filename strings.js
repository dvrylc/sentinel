const strings = {
  "noConfigError": `Error: No config file (config.json) found. A sample is available at ${__dirname}/config-sample.json.`,
  "noAbsoluteURLError": `Error: Config contains non-absolute URLs. Only absolute URLs starting with http or https are allowed.`,
  "noConnectionError": "Error: No active Internet connection found."
}

module.exports = strings;
