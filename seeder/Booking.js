const faker = require('faker')
const mongoose = require('mongoose')
const Vehicle = require('../models/Vehicle')
const User = require('../models/User')
const Floor = require('../models/Floor')
const Booking = require('../models/Booking')

const dbLink = 'mongodb://localhost/PMS'
mongoose.connect(dbLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})
.then(async (result) => {
    const users = await User.find({role:1}).select('_id').exec();
    const floors = await Floor.find().select('_id').exec()
    const vehicles = await Vehicle.find().select('_id').exec();
    for(var i=0; i<20; i++){
        booking = Booking();
        booking.user = users[i]._id;
        booking.vehicle = vehicles[i]._id;
        booking.startingTime = Date.now().toString();
        booking.bookingDuration = 10;
        booking.floor = floors[i]._id;
        booking.bookedSpot = i+1;
        booking.isActive = true;
        booking.save().then((result)=>console.log('Booking Added')).catch((err)=>console.log(err));
    }
})
.catch((err) => console.log(err))