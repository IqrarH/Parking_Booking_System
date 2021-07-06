var router = require('express').Router();

router.use('/users', require('./user'));
router.use('/bookings', require('./booking'))
router.use('/vehicles', require('./vehicle'))
router.use('/floors', require('./floor'))

module.exports = router;