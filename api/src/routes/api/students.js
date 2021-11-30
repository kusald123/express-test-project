
const mongoose = require('mongoose');
const router = require('express').Router();
const student = mongoose.model('Student');


router.param('studentId', function(req, res, next, studentId) {
    req.body.studentId = studentId;
    next();
})

router.post('/', async function(req, res) {
    const { studentId, name }  = req.body;

    if (!name) {
        return res.status(400).send('Name required');
    }

    if (!studentId) {
        return res.status(400).send('Student Id required');
    }

    const isExist = await student.findOne({ studentId});
    if (!isExist) {
        const newStudent = await student.create({
            name, 
            studentId
        });
        return res.status(201).send(newStudent);
    }
    return res.status(400).send('Student already exist');
});


router.get('/:studentId', async function(req,res) {
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).send('Student Id required');
    }

    const isExist = await student.findOne({studentId});
    if (isExist) {
        return res.status(200).send(isExist);
    }
    return res.status(404).send('Student not found');

});

module.exports = router;