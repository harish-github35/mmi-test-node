const fs = require("fs/promises");
const path = require("path");
const getnewtoken = require("./getNewToken");

module.exports = async function () {
  let token = null;
  const filePath = path.join(__dirname, "../routes/mmi/token.json");
  let fileExists = false;
  try {
    await fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        fileExists = false;
      } else {
        fileExists = true;
      }
    });
    if (fileExists) {
      const data = await fs.readFile(filePath, {
        encoding: "utf8",
      });

      if (data.trim()) {
        token = JSON.parse(data);

        // get new token if expired
        if ((Date.now() - token.timestamp) / 1000 >= token.expires_in - 3600) {
          token = await getnewtoken();
        }
      }
    } else {
      console.log("file no exist");
      token = await getnewtoken();
    }
  } catch (e) {
    console.log("error: ", e);
  }
  return token;
};
