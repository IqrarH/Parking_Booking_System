const Floor = require('../models/Floor')

const checkSpotAvailability = async function(req,res, next) {
    const data = await Floor.findOne({floorNumber:req.body.floor}).exec()
    if(data === null){
        res.status(203).send({message:'Unable to add booking, Invalid Floor'})
    }
    const temp = data.spots
    if(req.body.spotNo<25 && req.body.spotNo>0 && temp[req.body.spotNo-1].spotNo===req.body.spotNo && temp[req.body.spotNo-1].isBooked===false){
        next()
    }
    else{
        res.status(200).send({message:'Spot not available'})
    }
}

module.exports = {checkSpotAvailability}