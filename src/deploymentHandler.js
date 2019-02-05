"use strict";
import {
  notify,
  validateDeployment,
  requestTti,
  loadFromFirestore,
  saveToFirestore,
  calculateDelta
} from "./lib/";

import { deploymentWebhook } from "./__mocks__/deploymentWebhook";

export const localDeploymentPayload = async () => {
  const event = await deploymentWebhook;
  return handleDeployment(event);
};

const init = async event => {
  const body = validateDeployment(event);
  await notify(body, {
    state: "pending",
    description: "Validating payload"
  });

  // send request to lighthouse
  return body;
};

export const handleDeployment = async event => {
  try {
    const body = await init(event);
    const {
      sha,
      payload: { web_url }, // eslint-disable-line camelcase
      environment
    } = body.deployment;

    await notify(body, {
      state: "pending",
      description: "Running Lighthouse"
    });

    const data = await requestTti(web_url);

    if (data.runtimeError.code === "NO_ERROR") {
      const { full_name } = body.repository; // eslint-disable-line camelcase

      const [previousPR, previousMaster] = await loadFromFirestore(
        full_name,
        environment
      );

      const msg = `Master: ${calculateDelta(
        data,
        previousMaster.data
      )}s, Branch: ${calculateDelta(data, previousPR.data)}s`;

      await saveToFirestore({
        repo: full_name,
        sha: sha,
        data,
        environment: environment
      });

      await notify(body, {
        state: "success",
        description: msg
      });

      return msg;
    } else {
      throw new Error(data.runtimeError.code);
    }
  } catch (e) {
    console.log(e.message);
    const body = validateDeployment(event);
    await notify(body, { state: "error", description: e.message });
    return false;
  }
};
