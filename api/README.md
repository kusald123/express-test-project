This is the server created for the test.

First user need to register and then can get the jwt token to access the resources.

# API calls 

## User

### register (`url/api/register: POST`) 
* firstName - string
* lastName - string
* email - string
* password - string

### logins (`url/api/login: POST`)
* email - string
* password - string

After login, you'll get the jwt token, you need to add it to headers -> `token`

## Student

### create students (`url/api/student: POST`) 
* studentId - string
* name - string

### get student by student id (`url/api/student/:studentId : GET`)
* studentId - string


## Subject 

### create subjects (`url/api/subject: POST`) 
* subjectId - string
* name - string

### get subject by subject id (`url/api/subject/:subjectId : GET`)
* subjectId - string

## Grades 

### create grades (`url/api/grade: POST`) 
* grade - string
* min - Number
* max - Number

### get grade by each grade name (`url/api/subject/:grade : GET`)
* grade - string

## Marks

### create marks (`url/api/marks: POST`)
* studentId : string
* subjectId : string
* marks : Number
* year : string
* semester : Number

### get marks (`url/api/marks: GET`)
* studentId : string
* subjectId : string
* year : string
* grade: string

example -> `url/api/marks?studentId=TEST0010&year=2006`


## NOTE 
before starting the server, you need to create mongodb account or local DB and add the URL in env file.
after adding, please install the dependencies by using `npm i`
