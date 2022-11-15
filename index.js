import express from 'express';
import Joi from 'joi';
const app = express();

app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];
//http GET request
app.get('/', (req,res) => {
    res.send('Hello express')
});

app.get('/api/courses', (req,res) => {
    res.send(courses)
});

app.get('/api/courses/:id' , (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); // result.error
    if(error) return res.status(400).send(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
})

//http PUT Request(to update)
app.put('/api/courses/:id', (req, res) => {
    //Look up the course
    //If not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    //Validate
    //If not, return 400 - Bad request
    //const result = validateCourse(req.body);
    const { error } = validateCourse(req.body); // result.error
    if(error) {
        return res.status(400).send(error.details[0].message);
    }

    //Update course
    //Return the update course
    course.name = req.body.name;
    res.send(course);


})

//http DELETE request

app.delete('/api/courses/:id', (req, res) => {
    //Look up the course
    //Not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    //Delete
    let index = courses.indexOf(course);
    courses.splice(index, 1);

    //Return the same course
    res.send(course);

})

function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}


//PORT variable
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
});
