const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const db = require('./models/index.js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(routes);

db.sequelize.sync().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
  });
});
