const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const BrowserFetcher = require("puppeteer/lib/BrowserFetcher");
const browserFetcher = new BrowserFetcher(__dirname);
const packageJson = require("puppeteer/package.json");
const revision = packageJson.puppeteer.chromium_revision;
const revisionInfo = browserFetcher.revisionInfo(revision);

let opts = {
  lighthouseFlags: {
    output: "json",
    disableDeviceEmulation: true,
    port: ""
  },
  chromeFlags: ["--headless", "--no-sandbox"],
  writeTo: "./",
  sortByDate: true
};

export const requestTti = async url => {
  console.log("Launching lighthouse for " + url);
  const chrome = await chromeLauncher.launch({
    chromeFlags: opts.chromeFlags,
    chromePath: revisionInfo.executablePath
  });

  opts.lighthouseFlags.port = chrome.port;

  const res = await lighthouse(url, opts.lighthouseFlags);
  await chrome.kill();
  return JSON.parse(res.report);
};
