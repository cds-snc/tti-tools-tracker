require = require("esm")(module); // eslint-disable-line no-global-assign
const hello = require("./handler").hello;
const localPayload = require("./handler").localPayload;

const trackTti = async (request, response) => {
  await hello(request);
  response.status(200).send("Done!");
};

// used for local testing
(async () => {
  const argv = require("minimist")(process.argv.slice(2));
  const { mockPayload } = argv;
  if (mockPayload) {
    const result = await localPayload();
    console.log(result);
  }
})();

module.exports.trackTti = trackTti;
