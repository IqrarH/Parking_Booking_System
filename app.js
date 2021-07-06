const express = require('express');
const mongoose = require('mongoose')
const env_vars = require('./config')
const app = express();

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


app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/',require('./routes'));

app.use((req, res, next) => {
    res.status(404).send('Not Found')
})

