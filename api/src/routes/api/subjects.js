
const mongoose = require('mongoose');
const router = require('express').Router();
const subject = mongoose.model('Subject');


router.param('subjectId', function(req, res, next, subjectId) {
    req.body.subjectId = subjectId;
    next();
})

router.post('/', async function(req, res) {
    const { subjectId, name }  = req.body;

    if (!name) {
        return res.status(400).send('Name required');
    }

    if (!subjectId) {
        return res.status(400).send('Subject id required');
    }

    const isExist = await subject.findOne({ subjectId});
    if (!isExist) {
        const newSubject = await subject.create({
            name, 
            subjectId
        });
        return res.status(201).send(newSubject);
    }
    return res.status(400).send('Subject already exist');
});


router.get('/:subjectId', async function(req,res) {
    const { subjectId } = req.body;

    if (!subjectId) {
        return res.status(400).send('Subject Id required');
    }

    const isExist = await subject.findOne({subjectId});
    if (isExist) {
        return res.status(200).send(isExist);
    }
    return res.status(404).send('Subject not found');

});

module.exports = router;