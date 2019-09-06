//*********************** BASIC SERVER & PROJECT SETUP ***********************
var express = require("express"); // Require the Express Module
var app = express(); // Create an Express App
var bodyParser = require("body-parser"); // Require body-parser (to receive post data from clients)
var flash = require('express-flash');
var session = require('express-session');
var path = require("path"); // Require path


app.use(express.static(__dirname + "./static")); // Setting our Static Folder Directory
app.set('views', path.join(__dirname, './views')); // Setting our Views Folder Directory
app.set('view engine', 'ejs'); // Setting our View Engine set to EJS
app.use(bodyParser.urlencoded()); // Integrate body-parser with our App
app.listen(8000, function() {console.log("listening on port 8000")}) // listening function for the app, port: localhost:8000;
app.use(session({ //required for the app to use Session
    secret: "somesortofsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000}
}));
app.use(flash());
//*********************** BASIC SERVER & PROJECT SETUP ***********************



//******************** MONGOOSE SETUP ***********************
var mongoose = require('mongoose'); // Require the Mongoose Framework
// ******************** CHANGE PROJECT DATABASE NAME *********************************
mongoose.connect('mongodb://localhost/mongooseDashboard'); // change basic_mongoose to new project database name in the future
// ******************** MONGOOSE SETUP ***********************



// ******************** MODEL SETUP ***********************
var Schema = new mongoose.Schema({
	name: {type: String, required: true, minlength: 2},
	breed: {type: String, required: true, minlength: 2},
	size: {type: String, required: true, minlength: 2},
	age: {type: Number, required: true, minlength: 2},
	color: {type: String, required: true, minlength: 2},
	food: {type: String, required: true, minlength: 2},
	personality: {type: String, required: true, minlength: 2},
},
{timestamps: true});

mongoose.model('Bear', Schema);
var Bear = mongoose.model('Bear')
// ******************** MODEL SETUP ***********************



app.get("/", (req, res)=>{
    Bear.find()
        .then((bears) =>{
            return res.render("index", {bears:bears});
        })
        .catch((error)=>{
            console.log(error);
            return res.render("index");
        });
});

app.get('/bears/new', function(req, res) {
    return res.render('new');
});

app.get("/bears/:id", (req, res)=>{
    Bear.findOne({_id: req.params.id})
        .then((bear)=>{
            return res.render("show", {bear:bear});
        })
        .catch((error)=>{
            console.log(error);
            return res.redirect("/");
        })
});

app.get("/bears/edit/:id", (req, res)=>{
    Bear.findOne({_id: req.params.id})
        .then((bear)=>{
            return res.render("edit", {bear:bear});
        })
        .catch((error)=>{
            console.log(error);
            return res.redirect("/");
        })
});

app.post('/bears/edit_submit/:id', function(req, res) {
    Bear.updateOne({_id:req.params.id},{
        name: req.body.name,
		breed: req.body.breed,
		color: req.body.color,
		personality: req.body.personality,
		age: req.body.age,
		food: req.body.food,
		size: req.body.size,
	})
	.then((bear) =>{
		console.log("**********************");
		console.log(bear);
		return res.redirect("/bears/"+req.params.id);
	})
	.catch((error)=>{
		for(let err in error.errors){
			req.flash("errors", error.errors[err].message);
			
		}
		return res.redirect("/bears/"+req.params.id);
	});
});

app.post('/bears', function(req, res) {
    let new_bear = new Bear({
    	name: req.body.name,
        breed: req.body.breed,
        color: req.body.color,
        personality: req.body.personality,
        age: req.body.age,
        food: req.body.food,
        size: req.body.size,
    });
    new_bear.save()
		.then(() =>{
			return res.redirect(`/bears/${new_bear.id}`);
		})
		.catch((error)=>{
			for(let err in error.errors){
				req.flash("errors", error.errors[err].message);
			}
			return res.redirect("/bears/new");
		});
});


app.post('/bears/delete/:id', function(req, res) {
    Bear.remove({_id:req.params.id},function(err,bear){
        res.redirect('/');
    })
});