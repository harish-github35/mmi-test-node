const fs = require("fs/promises");
const path = require("path");
const { URLSearchParams } = require("url");

async function getnewtoken() {
  const body = {
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };

  const response = await fetch(
    "https://outpost.mappls.com/api/security/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(Object.entries(body)),
    }
  ).then((data) => data.json());
  const newAccessTokenObject = {
    timestamp: new Date().getTime(),
    ...response,
  };

  // save token and expiry time to token.json in background
  // console.log(__dirname);
  // fs.writeFile(
  //   path.join(__dirname, "../routes/mmi/token.json"),
  //   JSON.stringify(newAccessTokenObject),
  //   {
  //     flag: "w",
  //   }
  // );

  return newAccessTokenObject;
}

module.exports = getnewtoken;
