
const mongoose = require('mongoose');
require('../../model/mark');
const router = require('express').Router();
const markingSchema = mongoose.model('Mark');
const studentSchema = mongoose.model('Student');
const gradingSchema = mongoose.model('Grade');
const subjectSchema = mongoose.model('Subject');
const JSONStream = require('JSONStream');

router.post('/', async function (req, res) {
    const { studentId, subjectId, marks, semester, year } = req.body;
    if (!studentId) {
        return res.status(400).send('Student Id required');
    }
    if (!subjectId) {
        return res.status(400).send('Subject Id required');
    }
    if (!marks) {
        return res.status(400).send('Marks required');
    }
    if (!semester) {
        return res.status(400).send('Semester required');
    }
    if (!year) {
        return res.status(400).send('Year required');
    }

    const isStudentExists = await studentSchema.findOne({ studentId });
    if (!isStudentExists) {
        return res.status(400).send('Student not exists');
    }

    const isGradeExists = await gradingSchema.findOne({ max: { $gte: marks }, min: { $lte: marks } });
    if (!isGradeExists) {
        return res.status(400).send('Grade not exists');
    }

    const isSubjectExists = await subjectSchema.findOne({ subjectId });
    if (!isSubjectExists) {
        return res.status(400).send('Subject not exists');
    }

    const isRecordExists = await markingSchema.findOne({ "student.studentId": studentId, "subject.subjectId": subjectId, marks, semester, year });
    if (isRecordExists) {
        return res.status(400).send('Record exists');
    } else {
        const newMarks = await markingSchema.create({
            student: isStudentExists,
            mark: marks,
            subject: isSubjectExists,
            grade: isGradeExists,
            semester,
            year
        });
        return res.status(202).send(newMarks);
    }
});

router.param('studentId', function (req, res, next, studentId) {
    req.body.studentId = studentId;
    next();
});

router.param('year', function (req, res, next, year) {
    req.body.year = year;
    next();
});

router.param('grade', function (req, res, next, grade) {
    req.body.grade = grade;
    next();
});

router.param('subject', function (req, res, next, subject) {
    req.body.subject = subject;
    next();
});

router.get('/', async function (req, res) {
    //TODO:: error handling
    let { studentId, year, grade, subjectId } = req.query;

    if (!studentId && !year && !grade && !subjectId) {
        return res.status(400).send('At least one field required');
    }
    const query = {};
    if (studentId !== undefined) {
        const student = await studentSchema.findOne({ studentId });
        query.studentId = mongoose.Types.ObjectId(student._id);
    }
    if (year !== undefined) {
        query.year = year;
    }
    if (grade !== undefined) {
        const grading = await gradingSchema.findOne({ grade });
        query.grade = mongoose.Types.ObjectId(grading._id);
    }
    if (subjectId !== undefined) {
        const subject = await gradingSchema.findOne({ subjectId });
        query.subject = mongoose.Types.ObjectId(subject._id);
    }

    return markingSchema.findOne(query).cursor().pipe(JSONStream.stringify())
        .pipe(res);
});


module.exports = router;