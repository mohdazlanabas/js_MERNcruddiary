console.log("Application Startup Procedure")
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override');

console.log("App Starting")
// SET TEMPLATING ENGINE AS EJS
app.set('view engine', 'ejs');

//SERVING STATIC FILES
app.use(express.static('public'));

console.log("Middleware Started")
// BODY PARSER MIDDLEWARE
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//middleware for method-override
app.use(methodOverride('_method'));

//DATABASE
const url = 'mongodb+srv://coderazlan:Test01test@cluster0.tvvh4.mongodb.net/Diary?retryWrites=true&w=majority';

// connecting application to databse
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(console.log('MongoDB databse is connected!'))
    .catch(err => console.log(err))

// Import Diary Model
const Diary = require('./models/Diary');
const { process_params } = require('express/lib/router');

console.log("Routing functional")
// CREATE ROUTING
app.get('/', (req, res) => {
    res.render('Index');
})

app.get('/home', (req, res) => {
    res.render('Home');
})

app.get('/about', (req, res) => {
    res.render('About');
})

app.get('/diary', (req, res) => {
    Diary.find()
        .then(data => {
            // console.log(data)
            res.render('Diary', {data:data});
    }).catch(err=>console.log(err));
})

// CRUD OPERATION

// Add to Diary
app.get('/add', (req, res) => {
    res.render('add');
})

// Saving Diary
app.post('/add-to-diary', (req, res) => {
    // res.send(req.body.title);
    // ADD- save data to database 
    const Data = new Diary ({
        title:req.body.title,
        description:req.body.description,
        date:req.body.date
    })
    Data.save().then(() => {
        res.redirect('/diary');
    }).catch(err=>console.log(err));
})

// Route to display records
app.get('/diary/:id', (req, res) => {
    // res.send(req.params.id)
    Diary.findOne({
        _id:req.params.id
    }).then(data => {
        res.render('Page', {data:data});
    }).catch(err=>console.log(err));
})

// Route for edit page
app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id:req.params.id
    }).then(data => {
        res.render('Edit', {data:data});
    }).catch(err=>console.log(err));
})

// Edit Data
app.put("/diary/edit/:id", (req,res) =>{
    
    Diary.findOne({
        _id:req.params.id
    }).then(data => {
        data.title = req.body.title
        data.description = req.body.description
        data.date = req.body.date
        data.save().then(() => {
            res.redirect('/diary')
        }).catch(err=>console.log(err));
    }).catch(err=>console.log(err));
})

// Delete Data
app.delete("/data/delete/:id", (req,res) =>{
    Diary.remove({
        _id: req.params.id
    }).then(() => {
        res.redirect('/diary');
    }).catch(err=>console.log(err));
})

// CREATE SERVER
// app.listen(port,() => console.log('Server is running!'));
app.listen(process.env.PORT || port, () => console.log(`Server is running Llistening at http://localhost:${port}`));