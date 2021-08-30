const faker = require('faker')
const mongoose = require('mongoose')
const User = require('../models/User')

const dbLink = 'mongodb://localhost/PMS'
mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})
    .then((result) => {
            let newUser = User()
            newUser.name = 'admin'
            newUser.email = 'admin@gmail.com'
            newUser.setPassword('admin123')
            newUser.role = 0
            newUser.save().then((result) => console.log('Admin Added!'))
            .catch((err) => console.log(err))

            let newUser2 = User()
            newUser2.name = 'iqrar'
            newUser2.email = 'iqrar@gmail.com'
            newUser2.setPassword('iqrar123')
            newUser2.role = 0
            newUser2.save().then((result) => console.log('Admin Added!'))
            .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))

    // TODO create an index file here in this folder > export all arrays of enities to that index file
    // create a seeder.js in root folder connect with mongoose from there only once and drop the database
    // import all models there like app.js

    // import arrays and seed entities in the series of usage like user and vehicle