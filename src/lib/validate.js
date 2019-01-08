const parse = event => {
  const body = event.deployment_status;
  return { body };
};

const hasState = body => {
  if (!body || !body.state) {
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
