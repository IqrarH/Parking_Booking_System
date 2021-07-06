const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const Vehicle = require('../../models/Vehicle');
const User = require('../../models/User');
const app = express();
const auth = require('../../middlewares/auth');
const { authorize } = require('passport');
const Floor = require('../../models/Floor');

router.post('/addVehicle',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    //Vehicle.find().populate('owner').exec()
    const result = await User.findOne({email:req.body.owner}).exec();
    let vehicle = Vehicle();
    vehicle.owner = mongoose.Types.ObjectId(result._id);
    vehicle.vehicleNumber = req.body.vehicleNumber;
    vehicle.save((err,data)=>{
        if(err){
            res.status(203).send({message:'Not Added!! Vehicle with this number already exists'});
        }else{
            res.status(200).send({message:'Vehicle added successfully'});
        }
    })

})
router.put('/updateVehicle',auth.isToken,auth.isUser,auth.isAdmin,async(req,res)=>{
    const result = await User.findOne({email:req.body.newOwner}).exec();
    Vehicle.findOneAndUpdate({vehicleNumber:req.body.vehicleNumber},
        {owner:mongoose.Types.ObjectId(result._id)},function(err,data){
            if(err){
                console.log(err)
                res.status(203).send({message:'Cannot find the new owner'});
            }else{
                res.status(200).send({message:'Vehicle updated successfully'});
            }
        }
    )
})
router.delete('/removeVehicle/:vehicleNumber',auth.isToken,auth.isUser,auth.isAdmin,(req,res)=>{
    Vehicle.deleteOne({vehicleNumber:req.params.vehicleNumber},
        function(err, data) {
            if(err){
                res.status(203).send({message: 'Unable to delete Vehicle'})
            }
            else{
                res.status(200).send({message: 'Vehicle has been deleted successfully'})
            }
    })
})
router.get('/showVehicle/:vehicleNumber',auth.isToken,auth.isUser,auth.isAdmin,(req,res)=>{
    Vehicle.findOne({vehicleNumber:req.params.vehicleNumber},{_id:false}).populate('owner','name email -_id').exec((err,data)=>{
        if(err){
            res.status(203).send({message:'Vehicle Not Found'});
        }else{
            res.status(200).send(data);
        }
    })
})

router.get('/showAll',auth.isToken,auth.isUser,auth.isAdmin,(req,res)=>{
    Vehicle.find((err,data)=>{
        if(err){
            res.status(203).send({message: 'Unable to show Vehicles'})
        }
        else{
            res.status(200).send(data)
        }
    })
})


router.get('/',(req,res)=>{
    res.send('PMS is ON!!!')
})

module.exports = router;