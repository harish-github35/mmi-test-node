const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());
app.use(cors());

const mmiRouter = require("./routes/mmi/mmi.router");

app.use("/mmi/api", mmiRouter);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("server running on localhost:3001"));
