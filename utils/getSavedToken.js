const fs = require("fs/promises");
const path = require("path");

module.exports = async function () {
  let savedTokenObject = null;
  try {
    const data = await fs.readFile(
      path.join(__dirname, "../routes/mmi/token.json"),
      {
        encoding: "utf8",
      }
    );
    if (data.trim()) {
      savedTokenObject = JSON.parse(data);
    }
  } catch (e) {
    console.log("error reading token.json");
  }
  return savedTokenObject;
};
