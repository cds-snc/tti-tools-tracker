"use strict";
import octokit, {
  notify,
  validate,
  requestTti,
  loadFromFirestore,
  saveToFirestore
} from "./lib/";

import { webhook } from "./__mocks__/webhook";

export const localPayload = async () => {
  const event = await webhook;
  return hello(event);
};

const init = event => {
  const body = validate(event);

  notify(body, octokit, {
    state: "pending",
    description: "Validating payload"
  });

  // send request to lighthouse
  return body;
};

export const hello = async event => {
  try {
    const body = init(event);
    const {
      sha,
      payload: { web_url }, // eslint-disable-line camelcase
      environment
    } = body.deployment;

    notify(body, octokit, {
      state: "pending",
      description: "Running Lighthouse"
    });

    const data = await requestTti(web_url);

    const { full_name } = body.repository; // eslint-disable-line camelcase

    const [previousPR, previousMaster] = await loadFromFirestore(
      full_name,
      environment
    );

    /*
    await saveToFirestore({
      repo: full_name,
      sha: sha,
      data,
      environment: environment
    });
    */

    const msg = "called it";
    return msg;
  } catch (e) {
    console.log(e.message);
    const body = validate(event);
    await notify(body, octokit, { state: "error", description: e.message });
    return false;
  }
};
