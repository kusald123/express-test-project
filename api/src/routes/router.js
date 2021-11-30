const router = require('express').Router();

router.use('/api',require('./api/module'));

module.exports = router;