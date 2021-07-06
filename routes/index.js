var router = require('express').Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd()+'/public/index.html'))
})

router.use('/api', require('./api'));

module.exports = router;