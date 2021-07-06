var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const mongoosastic = require('mongoosastic')

var BookingSchema = new mongoose.Schema({
    bookedFor:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    bookedForVehicle:{type: mongoose.Schema.Types.ObjectId, unique:true,ref: 'Vehicle'},
    bookingTime:{type:Date, default: Date.now},
    bookingDuration:{type:Number, required:true},
    bookedFloor:{type: mongoose.Schema.Types.ObjectId, ref: 'Floor'},
    bookedSpot:{type:Number, required:true},
    isActive:{type:Boolean,required:true},
});

BookingSchema.plugin(uniqueValidator)
BookingSchema.plugin(mongoosastic)

var Booking = mongoose.model('Booking',BookingSchema);
module.exports = Booking;