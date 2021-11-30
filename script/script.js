const axios = require('axios').default;
require('dotenv').config();
const API_URL = process.env.API_URL;

let token;

const STUDENT_COUNT = 20;
const SUBJECT_COUNT = 20;
const GRADES_COUNT = 10;

const STUDENT_ID_PREFIX = 'TEST001';
const SUBJECT_ID_PREFIX = 'EM230';

const STARTING_YEAR = 2000;


// register a user
axios.post(API_URL + '/api/register', {
    firstName: 'john',
    lastName: 'doe',
    email: 'johndoe1223@gmail.com',
    password: 'test1234'
}).then((res) => {
    // login
    console.log('User registered');
    return login();
}).catch((err) => {
    console.log('User registered');
    // if user exists
    return login();
})
.then((res) => {
    console.log('Login Success');
    if (res && res.data && res.data.token) {
        token = res.data.token;
    }
    // create 20 students
    return createStudents();
})
.then((res) => {
    console.log('Created Students');
    // successfully added the students
    // create subjects
    return createSubjects();
})
.catch(err => {
    console.log('Created Students');
    // students already exists
    // create subjects
    return createSubjects();
})
.then((res) => {
    console.log('Created Subjects');
    // create grades
    return createGrades();
}).catch(err => {
    console.log('Created Subjects');
    // if subjects alredy created,
    return createGrades();
}).then((res) => {
    console.log('Created Grades');
    // creating marks
    return createMarks();
}).then((res) => {
    console.log('Created Marks');
}).catch((res) => {
    //if grades already created
    console.log('Err Created Marks',res);
});



function login() {
    return axios.post(API_URL + '/api/login', {
        email: 'johndoe1223@gmail.com',
        password: 'test1234'
    });
}


function createStudents() {
    const studentPromises = [];
    const studentURL = API_URL + '/api/student'
    for (let i = 0; i < STUDENT_COUNT; i++) {
        studentPromises.push(axios.post(studentURL, {
            studentId: STUDENT_ID_PREFIX + i,
            name: 'Test Student'
        }, {
            headers: {
                token
            }
        }));
    }
    return Promise.all(studentPromises);
}


function createSubjects() {
    const subjectPromises = [];
    const subjectURL = API_URL + '/api/subject'
    for (let i = 0; i < SUBJECT_COUNT; i++) {
        subjectPromises.push(axios.post(subjectURL, {
            subjectId: SUBJECT_ID_PREFIX + i,
            name: 'Engineering Fundamentals ' + i
        }, {
            headers: {
                token
            }
        }));
    }
    return Promise.all(subjectPromises);
}

function createGrades() {
    const gradesPromises = [];
    const grades = ['F', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A-', 'A', 'A+']
    const gradesURL = API_URL + '/api/grade';
    for (let i = 0; i < GRADES_COUNT; i++) {
        gradesPromises.push(axios.post(gradesURL, {
            grade: grades[i],
            min: i * 10,
            max: (i + 1) * 10
        }, {
            headers: {
                token
            }
        }));
    }
    return Promise.all(gradesPromises);
}


function createMarks() {
    // get each student
    let marksObjects = [];
    const limit = 100;
    const marksURL = API_URL + '/api/marks'
    for (let i = 0; i < STUDENT_COUNT; i++) {
        const studentId = STUDENT_ID_PREFIX + i;
        for (let m = 0; m < SUBJECT_COUNT; m++) {
            const subjectId = SUBJECT_ID_PREFIX + m;
            for (let y = STARTING_YEAR; y < 2011; y++) {
                const marksObj1 = {
                    studentId,
                    subjectId,
                    marks: getRandom(1, 100),
                    semester: 1,
                    year: y.toString()
                }
                marksObjects.push(marksObj1);
                const marksObj2 = {
                    studentId,
                    subjectId,
                    marks: getRandom(1, 100),
                    semester: 2,
                    year: y.toString()
                }
                marksObjects.push(marksObj2);
            }
        }
    }
    const marksObjectLength = marksObjects.length;
    const executePromises = (array, start) => {
        if (marksObjectLength < (start+limit)) {
            return Promise.resolve(true);
        }
        const promises = [];
        for (let i = start; i < (start + limit); i++) {
            promises.push(axios.post(marksURL, array[i], {
                headers: {
                    token
                }
            }))
        }
        return Promise.all(promises).then((res) => {
            console.log('Marks -> batch ', start, start+limit);
            return executePromises(array, start+limit);
        }).catch(err=> {
            console.log('Marks -> err batch ', start, start+limit);
            return executePromises(array, start+limit);
        })
    }
    return executePromises(marksObjects, 0);
}

// returns a random value for given min n max values
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}