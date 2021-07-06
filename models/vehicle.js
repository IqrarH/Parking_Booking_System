var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const mongoosastic = require('mongoosastic')

var VehicleSchema = new mongoose.Schema({
    owner:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    vehicleNumber:{type:String,required:true,unique:true}
});

VehicleSchema.plugin(uniqueValidator)
VehicleSchema.plugin(mongoosastic)

var Vehicle = mongoose.model('Vehicle',VehicleSchema);
module.exports = Vehicle;