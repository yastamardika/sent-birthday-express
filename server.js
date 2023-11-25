const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json 
app.use(bodyParser.json())

const db = require('./models');
db.sequelize.sync();

const personRoute = require('./app/routes/person.routes');
app.use('/api/person', personRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const callCronEndpoint = (endpoint, num) => {
    axios.get(endpoint)
      .then(response => {
        console.log(`Endpoint ${num} called:`, response.data);
      })
      .catch(error => {
        console.error('Error calling Endpoint 2:', error.message);
      });
};

cron.schedule('*/30 * * * *', () => {
    // Call endpoint 1
    callCronEndpoint('http://localhost:5000/api/person/set-birthday-status', 1);
  
    // Call endpoint 2
    callCronEndpoint('http://localhost:5000/api/person/sent-mail', 2);
  });
  
app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));