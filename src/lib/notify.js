/* https://octokit.github.io/rest.js/ */
import { authenticate } from "./githubAuth";

require("dotenv-safe").config({ allowEmptyValues: true });

const validate = event => {
  if (
    !event ||
    !event.repository ||
    !event.repository.name ||
    !event.repository.owner ||
    !event.repository.owner.login
  ) {
    return false;
  }

  return true;
};

export const notify = async (
  event,
  status = { state: "pending", description: "Checking TTI" }
) => {
  if (!validate(event)) return false;

  const client = await authenticate(event.installation.id);

  const repoOwner = event.repository.owner.login;
  const repoName = event.repository.name;

  const statusObj = Object.assign(
    {
      owner: repoOwner,
      repo: repoName,
      sha: event.deployment.sha,
      context: "TTI Tracker"
    },
    status
  );
  console.log(statusObj);
  const result = await client.repos.createStatus(statusObj);
  console.log("RESULT", result);

  return result;
};
