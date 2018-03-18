const strings = {
  "help": `\n\tUsage: sentinel [options]\n\n\tA command-line site monitor\n\n\tOptions:\n\t-h, --help\t\tPrints this help message\n\n\tConfig file:\n\t${__dirname}/config.json\n`,

  "noConfigError": `Error: No config file found at ${__dirname}/config.json.`,
  "noAbsoluteURLError": `Error: Config contains non-absolute URLs. Only absolute URLs starting with http or https are allowed.`,
  "noConnectionError": "Error: No active Internet connection found."
}

module.exports = strings;
