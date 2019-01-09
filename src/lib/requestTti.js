const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
let opts = {
  lighthouseFlags: {
    output: "json",
    disableDeviceEmulation: true,
    port: ""
  },
  chromeFlags: ["--headless"],
  writeTo: "./",
  sortByDate: true
};

export const requestTti = async url => {
  console.log("Launching lighthouse for " + url);
  const chrome = await chromeLauncher.launch({ chromeFlags: opts.chromeFlags });

  opts.lighthouseFlags.port = chrome.port;

  const res = await lighthouse(url, opts.lighthouseFlags);
  await chrome.kill();
  return JSON.parse(res.report);
};
