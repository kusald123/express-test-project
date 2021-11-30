const router = require('express').Router();
const authCheck = require('../../middleware/auth-check');

router.use('/', require('./users'));
router.use('/student', authCheck, require('./students'));
router.use('/subject', authCheck, require('./subjects'));
router.use('/grade', authCheck, require('./grades'));
router.use('/marks', authCheck, require('./marks'));

module.exports = router;