const faker = require('faker')
const mongoose = require('mongoose')
const Vehicle = require('../models/Vehicle')
const User = require('../models/User')


const dbLink = 'mongodb://localhost/PMS'
mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})
.then((result) => {

    User.find({role:1}).select('_id').exec((err, data)=> {
        if(!err){
            for(var i=0; i<100; i++){
                let vehicle = Vehicle();
                vehicle.owner = data[i]._id;
                vehicle.vehicleNumber = faker.vehicle.vrm();
                vehicle.save().then((result) => console.log('Vehicle Added!'))
                .catch((err) => console.log('Unable to add vehicle'))
            }
        }
    })
})
.catch((err) => console.log(err))