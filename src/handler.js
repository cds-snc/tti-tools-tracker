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
    description: "Checking TTI"
  });

  //send request to lighthouse
  return body;
};

export const hello = async event => {
  try {
    const body = init(event);
    const data = await requestTti("https://example.com");

    console.log(data);

    /*
     "sha": "8bf351bf0e7d2ce02f1297c108352e28b8c64d25",
      "ref": "8bf351bf0e7d2ce02f1297c108352e28b8c64d25",
      "task": "deploy",
      "payload": {
        "web_url": "https://bundle-size-tracker-demo-pr-15.herokuapp.com/"
      },

    */

    await saveToFirestore({
      repo: "hey",
      sha:  event.deployment.sha,
      data,
      branch: "123"
    });

    const msg = "called it";
    return msg;
  } catch (e) {
    console.log(e.message);
    const body = validate(event);
    await notify(body, octokit, { state: "error", description: e.message });
    return false;
  }
};
