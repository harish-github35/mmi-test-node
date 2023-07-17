const fs = require("fs/promises");
const path = require("path");
const getnewtoken = require("./getNewToken");

module.exports = async function () {
  let token = null;
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../routes/mmi/token.json"),
      {
        encoding: "utf8",
      }
    );
    if (data.trim()) {
      token = JSON.parse(data);
      
      // get new token if expired
      if ((Date.now() - token.timestamp) / 1000 >=(token.expires_in-3600)) {
        // get new token from https://outpost.mappls.com/api/security/oauth/token
        token = await getnewtoken();
      }
    }
  } catch (e) {
    console.log("error: ", e);
  }
  return token;
};
