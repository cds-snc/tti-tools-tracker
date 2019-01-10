const parse = event => {
  const body = event.body;
  return { body };
};

const hasMerged = body => {
  if (
    !body ||
    !body.pull_request ||
    !body.pull_request.state ||
    !body.pull_request.merged
  ) {
    throw new Error("Invalid event pull_request data");
  }

  if (
    body.pull_request.state !== "closed" &&
    body.pull_request.merged !== "true"
  ) {
    throw new Error("Pull request is not merged and closed");
  }

  return true;
};

const hasState = body => {
  if (!body || !body.deployment_status || !body.deployment_status.state) {
    throw new Error("Invalid event deployment_status data");
  }

  if (!body.deployment || !body.deployment.sha || !body.deployment.payload) {
    throw new Error("Invalid event deployment data");
  }

  return true;
};

export const validateDeployment = event => {
  const { body } = parse(event);
  if (!hasState(body)) {
    return false;
  }
  return body;
};

export const validatePR = event => {
  const { body } = parse(event);
  if (!hasMerged(body)) {
    return false;
  }
  return body;
};
