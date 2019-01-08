"use strict";
import octokit, {
  notify,
  validate,
  build,
  loadFromFirestore,
  saveToFirestore
} from "./lib/";

import { webhook } from "./__mocks__/webhook";

export const localPayload = async () => {
  const event = await webhook;
  return hello(event);
};

const init = event => {
  const body = validate(event)

  notify(body, octokit, {
    state: "pending",
    description: "Checking TTI"
  });

  return body;
};

export const hello = async event => {
  try {
    const body = init(event);
    const msg = "called it";
    return msg;
  } catch (e) {
    console.log(e.message);
    const body = validate(event);
    await notify(body, octokit, { state: "error", description: e.message });
    return false;
  }
};
