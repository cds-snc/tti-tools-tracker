const request = require("request");

export const requestTti = (url, cb) => {
  const options = {
    method: "POST",
    url: process.env.LIGHTHOUSE_URL,
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": "abc123"
    },
    body: { output: "json", url },
    json: true
  };

  console.log(options);

  request(options, (error, response, body) => {
    console.log("error:", error);
    if (error) throw new Error(error);
    console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
    console.log("body:", body);
    cb(body);
  });
};
