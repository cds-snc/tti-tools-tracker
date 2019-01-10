require = require("esm")(module); // eslint-disable-line no-global-assign
const deploymentHandler = require("./deploymentHandler").handleDeployment;
const PRHandler = require("./prHandler").handlePR;

const localDeploymentPayload = require("./deploymentHandler")
  .localDeploymentPayload;
const localPRPayload = require("./prHandler").localPRPayload;

const trackTti = async (request, response) => {
  switch (request.headers("X-GitHub-Event")) {
    case "deployment_status":
      await deploymentHandler(request);
      response.status(200).send("Processed deployment.");
      break;
    case "pull_request":
      await PRHandler(request);
      response.status(200).send("Processed pull request.");
      break;
    default:
      response.status(200).send("No action taken.");
      break;
  }
};

// used for local testing
(async () => {
  const argv = require("minimist")(process.argv.slice(2));
  const { pr, deployment } = argv;
  if (deployment) {
    const result = await localDeploymentPayload();
    console.log(result);
  }
  if (pr) {
    const result = await localPRPayload();
    console.log(result);
  }
})();

module.exports.trackTti = trackTti;
