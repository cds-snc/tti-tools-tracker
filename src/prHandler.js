"use strict";
import { validatePR, copyToMaster } from "./lib/";

import { prWebhook } from "./__mocks__/prWebhook";

export const localPRPayload = async () => {
  const event = await prWebhook;
  return handlePR(event);
};

const init = event => {
  const body = validatePR(event);
  return body;
};

export const handlePR = async event => {
  try {
    const body = init(event);
    const sha = body.pull_request.head.sha;

    await copyToMaster(sha);

    const msg = "Done";
    return msg;
  } catch (e) {
    console.log(e.message);
    return false;
  }
};
