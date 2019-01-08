const parse = event => {
  const body = event.body;
  return { body };
};

const hasState = body => {
  if (!body || !body.deployment_status || !body.deployment_status.state) {
    throw new Error("Invalid event data");
  }

  return true;
};

export const validate = event => {
  const { body } = parse(event);
  if (!hasState(body)) {
    return false;
  }
  return body;
};
