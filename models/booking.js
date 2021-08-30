var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const mongoosastic = require('mongoosastic')
// TODO remove the keyword of booked
var BookingSchema = new mongoose.Schema({
    user:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // TODO rename this to user
    vehicle:{type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle'}, // TODO rename this to vehicle
    startingTime:{type:Date, default: Date.now}, 
    bookingDuration:{type:Number, required:true},
    floor:{type: mongoose.Schema.Types.ObjectId, ref: 'Floor'},
    bookedSpot:{type:Number, required:true},
    isActive:{type:Boolean,required:true},// TODO Look for the workaround
});

BookingSchema.plugin(uniqueValidator)
BookingSchema.plugin(mongoosastic)

var Booking = mongoose.model('Booking',BookingSchema);
module.exports = Booking;