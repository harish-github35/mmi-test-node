const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
var cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const mmiRouter = require('./routes/mmi/mmi.router');

app.use('/mmi/api', mmiRouter);

app.post('/user', (req, res) => {
  res.status(200).json({
    message: 'callback has been called',
    query: req.query,
    body: req.body,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log('server running on localhost:3001'));
