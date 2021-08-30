const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const bodyParser = require('body-parser');
const env_vars = require('./config')
const app = express();

let allowedOrigins = [
    "http://localhost:4200",
    "http://localhost:4300",
    "http://localhost:3000",
];

mongoose.connect(env_vars.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
}).then((result) => app.listen(env_vars.port || process.env.PORT, () => {
    console.log('Server Listening');
})).catch((err) => console.log(err))

require('./models/User')
require('./models/Booking')
require('./models/Floor')
require('./models/Vehicle')



app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.json({ limit: '500mb' }));
app.use('/',require('./routes'));
app.use((req, res, next) => {
    res.status(404).send('Not Found')
})



