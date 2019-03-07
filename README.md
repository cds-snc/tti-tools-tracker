# Time to interactive tracker
![Phase](https://img.shields.io/badge/Phase-Alpha-f90277.svg) [![Maintainability](https://api.codeclimate.com/v1/badges/5a8169cb88b8b89aa75f/maintainability)](https://codeclimate.com/github/cds-snc/tti-tools-tracker/maintainability)

**NOTE: This tool is still in testing.**

### Purpose

The purpose of this tool is to check how long an application takes before it can be interacted with. Another definition would be the time it takes to completely load.

### How do I use it?

All you need to do is install the GitHub application found here: _Coming soon!_

You also need to be using a `deployment` implementation on GitHub. (ex. [Heroku's Review apps](https://devcenter.heroku.com/articles/github-integration-review-apps)).

### Work flow

The tool is designed as GitHub application that subscribes to `deployment` events (https://developer.github.com/v3/repos/deployments/) on pull request branches. The specific use case at CDS targets [Heroku's Review apps](https://devcenter.heroku.com/articles/github-integration-review-apps), which are created on every push to a branch. 

Once the application receives the event, it extracts the URL for the application, loads the URL using [Lighthouse](https://developers.google.com/web/tools/lighthouse/), and and returns the time it takes for the URL to become interactive. The result is then saved in a database and if there are previous results for that branch, a delta is calculated.

### Implementation

The tool is implemented as a Google Cloud function. Any merges to master are automatically deployed after testing passes using Google's Cloud build service (check `cloudbuild.yaml` for more information). [Lighthouse](https://developers.google.com/web/tools/lighthouse/) is used to determin the time to interaction for a given URL. Google's Firestore is used a database to track values so that deltas can be calculated.

### Questions?

Please contact us through any of the multiple ways listed on our [website](https://digital.canada.ca/).
