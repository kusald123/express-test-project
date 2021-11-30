
const mongoose = require('mongoose');
const router = require('express').Router();
const gradeSchema = mongoose.model('Grade');


router.param('grade', function(req, res, next, grade) {
    req.body.grade = grade;
    next();
})

router.post('/', async function(req, res) {
    const { grade, min, max }  = req.body;

    if (!grade) {
        return res.status(400).send('Grade required');
    }
    if (min == undefined) {
        return res.status(400).send('Min required');
    }
    if (max == undefined) {
        return res.status(400).send('Max required');
    }

    const isExist = await gradeSchema.findOne({ grade});
    if (!isExist) {
        const newGrade = await gradeSchema.create({
            grade, 
            min,
            max
        });
        return res.status(201).send(newGrade);
    }
    return res.status(400).send('Grade already exist');
});


router.get('/:grade', async function(req,res) {
    const { grade } = req.body;

    if (!grade) {
        return res.status(400).send('Grade required');
    }

    const isExist = await gradeSchema.findOne({grade});
    if (isExist) {
        return res.status(200).send(isExist);
    }
    return res.status(404).send('Grade not found');

});

module.exports = router;