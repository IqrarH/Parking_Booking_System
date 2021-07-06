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
    for(var i=0; i<100; i++){
        let user = User();
        user.name = faker.name.findName();
        user.email = faker.internet.email();
        user.setPassword(faker.internet.password());
        user.role = 1;
        user.save().then((result)=>console.log('User Added')).catch((err)=>console.log(err));
    }
})
.catch((err) => console.log(err))