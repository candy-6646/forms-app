//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//setting mongoDB
const url = "mongodb+srv://candy:" + process.env.MONGO_PASSWORD + "@cluster0.q3nwv.mongodb.net/formsDB";
mongoose.connect(url, {useNewUrlParser: true}); 

const responseQuesSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const ResQue = new mongoose.model("ResQue", responseQuesSchema);

const responseSchema = new mongoose.Schema({
    ownerName: String,
    ownerEmail: String,
    time: String,
    responseQuestions: [responseQuesSchema]
});
const Response = new mongoose.model("Response", responseSchema);

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    type: String
});
const Ques = new mongoose.model("Ques", questionSchema);

const formSchema = new mongoose.Schema({
    title: String,
    description: String,
    questions: [questionSchema],
    responses: [responseSchema],
    public: String,
    color: String
});
const Form = new mongoose.model("Form", formSchema);

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    forms: [formSchema]
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id); 
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


//google strategy
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://data-collector-v6rn.onrender.com/auth/google/dashboard"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);

    User.findOrCreate({ googleId: profile.id, name: profile.displayName }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/dashboard', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets page.
    res.redirect('/dashboard');
});

app.get("/",function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect('/');
});

app.get("/register", function(req, res) {
    res.render("register");
});


app.get("/dashboard", function(req, res) {
    if(req.isAuthenticated()) {
        User.findOne({_id: req.user._id}, function(err, foundUser){
            if(!err) {
                res.render("dashboard", {allForms: foundUser.forms, userName: foundUser.name});
            }else {
                console.log(err);
            }
        });
    }else{
        res.redirect("/login");
    }   
});


app.get("/dashboard/create", function(req, res) {
    if(req.isAuthenticated()) {
        const sampleQues1 = new Ques({
            question: "Name",
            type: "name"
        });
        const sampleQues2 = new Ques({
            question: "Email",
            type: "email"
        });

        const newForm = new Form({
            title: "Untitled Form",
            description: "Form Description",
            questions: [sampleQues1, sampleQues2],
            public: "off",
            color: "form-white"
        });

        User.findOneAndUpdate({_id: req.user._id}, {$push: {forms: newForm}}, function(err, foundUser){
            if (!err){
                User.findOne({"_id": req.user._id},{forms: {$elemMatch: {_id: newForm._id}}}, function(err, foundForm){
                    if (!err){
                        res.render("create", {form: foundForm.forms[0], allQuestions: foundForm.forms[0].questions});
                    }else {
                        console.log(err);
                    }
                });
            }
        });
        
    }else{
        res.redirect("/login");
    }
});


app.get("/:userId/:formId", function(req, res) {
    let userId = req.params.userId;
    let formId = req.params.formId;
    User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
        if (!err){
            if(foundForm.forms[0].public === "on") {
                res.render("form", {form: foundForm.forms[0], allQuestions: foundForm.forms[0].questions, userId: userId});
            }else{
                res.render("formOff", {form: foundForm.forms[0]});
            }
           
        }else {
            res.redirect("/login");
        }
    });
});

app.get("/dashboard/forms/:formId", function(req, res) {
    if(req.isAuthenticated()) {
        User.findOne({"_id": req.user._id},{forms: {$elemMatch: {_id: req.params.formId}}}, function(err, foundForm){
            if (!err){
                res.render("create", {form: foundForm.forms[0], allQuestions: foundForm.forms[0].questions});
            }else {
                res.redirect("/dashboard");
            }
        });
    }else {
        res.redirect("/login");
    }
    
});


app.get("/dashboard/forms/:formId/responses", function(req, res) {
    if(req.isAuthenticated()) {
        User.findOne({"_id": req.user._id},{forms: {$elemMatch: {_id: req.params.formId}}}, function(err, foundForm){
            if (!err){
                res.render("responses", {form: foundForm.forms[0], userName: req.user.name, userId: req.user._id});
            }else {
                res.redirect("/dashboard");
            }
        });
    }else{
        res.redirect("/login");
    } 
});



app.get("/dashboard/forms/:formId/responses/:responseId", function(req, res) {
    let responseId = req.params.responseId;
    if(req.isAuthenticated()) {
        User.findOne({"_id": req.user._id},{forms: {$elemMatch: {_id: req.params.formId}}}, function(err, foundForm){
            if (!err){
                let currentResponses = foundForm.forms[0].responses;
                let userResponse;
                currentResponses.forEach((element, index) => {
                    if(element._id == responseId) {
                        userResponse = currentResponses[index];
                    }
                });
                res.render("response", {form: foundForm.forms[0], userName: req.user.name, userId: req.user._id, userResponse: userResponse});
            }else {
                res.redirect("/dashboard");
            }
        });
    }else{
        res.redirect("/login");
    } 
});


app.get("/dashboard/forms/:formId/responses/:responseId/delete", function(req, res) {
    let responseId = req.params.responseId;
    if(req.isAuthenticated()) {
        User.findOne({"_id": req.user._id},{forms: {$elemMatch: {_id: req.params.formId}}}, function(err, foundForm){
            if (!err){
                let currentResponses = foundForm.forms[0].responses;
                let result = currentResponses.filter(obj => {
                    return obj._id != responseId;
                });

                foundForm.forms[0].responses = result;
                foundForm.save();
                res.redirect("/dashboard/forms/" + req.params.formId + "/responses");
            }else {
                res.redirect("/dashboard");
            }
        });
    }else{
        res.redirect("/login");
    } 
});



app.post("/:formId/titleSave", function(req, res) {
    let userId = req.user._id;
    let formId = req.params.formId;
    User.updateOne(
        { _id: userId , "forms._id": formId},
        { $set:{ "forms.$.title": req.body.formTitle, "forms.$.description": req.body.formDesc} },
        { upsert: true }, 
        function(err, foundNote){
            if(!err) {
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        }
    );
});


app.post("/:formId/makePublic", function(req,res) {
    let userId = req.user._id;
    let formId = req.params.formId;
    User.updateOne(
        { _id: userId , "forms._id": formId},
        { $set:{ "forms.$.public": req.body.public} },
        { upsert: true }, 
        function(err, foundNote){
            if(!err) {
                res.redirect("/dashboard/forms/" + formId + "/responses");
            }else {
                console.log(err);
            }
        }
    );
});

app.post("/dashboard/:formId/deleteForm", function(req, res) {
    let userId = req.user._id;
    let formId = req.params.formId;
    let quesId = req.body.quesId;

    if(quesId != 'form') {
        User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
            if (!err){
                let currentQuestions = foundForm.forms[0].questions;
                let result = currentQuestions.filter(obj => {
                    return obj._id != quesId;
                });

                foundForm.forms[0].questions = result;
                foundForm.save();
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        });
    }else {
        User.findOneAndUpdate({_id: userId}, {$pull: {forms: {_id: formId}}}, function(err, foundUser){
            if (!err){
                res.redirect("/dashboard");
            }else {
                console.log(err);
            }
        });
    }

    
});

app.post("/dashboard/:formId/add/textQuestion", function(req, res) {
    let userId = req.user._id;
    let formId = req.params.formId;
    let quesId = req.body.quesId;


    const sampleQues1 = new Ques({
        question: req.body.newQuestion,
        type: "text"
    });

    if(quesId != "form") {
        User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
            if (!err){
                let currentQuestions = foundForm.forms[0].questions;
                currentQuestions.forEach((element, index) => {
                    if(element._id == quesId) {
                        currentQuestions[index] = sampleQues1;
                    }
                });

                foundForm.save();
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        });
    }else {
        const sampleQues1 = new Ques({
            question: req.body.newQuestion,
            type: "text"
        });
    
        User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
            if (!err){
                foundForm.forms[0].questions.push(sampleQues1);
                foundForm.save();
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        });
    }
    
});

app.post("/dashboard/:formId/add/mcqQuestion", function(req,res) {
    let userId = req.user._id;
    let formId = req.params.formId;
    let reqBody = req.body;
    let newQues = reqBody.newQuestion;
    let quesId = req.body.quesId;
    delete reqBody.quesId
    delete reqBody.newQuestion
    let newOptions = [];

    for (const option in reqBody) {
        newOptions.push(reqBody[option]);
    }

    const sampleQues1 = new Ques({
        question: newQues,
        type: "mcq",
        options: newOptions
    });


    if(quesId != "form")  {
        User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
            if (!err){
                let currentQuestions = foundForm.forms[0].questions;
                currentQuestions.forEach((element, index) => {
                    if(element._id == quesId) {
                        currentQuestions[index] = sampleQues1;
                    }
                });

                foundForm.save();
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        });
    }else {
        User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
            if (!err){
                foundForm.forms[0].questions.push(sampleQues1);
                foundForm.save();
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        });
    }

    
});


app.post("/dashboard/:formId/changeColor", function(req, res) {
    let userId = req.user._id;
    let formId = req.params.formId;
    User.updateOne(
        { _id: userId , "forms._id": formId},
        { $set:{ "forms.$.color": req.body.newColor} },
        { upsert: true }, 
        function(err, foundNote){
            if(!err) {
                res.redirect("/dashboard/forms/" + formId);
            }else {
                console.log(err);
            }
        }
    );
});


app.post("/:userId/:formId", function(req, res) {
    let userId = req.params.userId;
    let formId = req.params.formId;
    let reqBody = req.body;
    let userName = req.body.name;
    let userEmail = req.body.email;
    let resptime = new Date().toLocaleString("en-Us", {timeZone: 'Asia/Kolkata'});
    delete reqBody.name;
    delete reqBody.email;
    let userRespQuesArr = [];

    for (let ques in reqBody) {
        let newResQue = new ResQue({
            question: ques,
            answer: reqBody[ques]
        })
        userRespQuesArr.push(newResQue);
    }


    let userResponse = new Response({
        ownerName: userName,
        ownerEmail: userEmail,
        time: resptime,
        responseQuestions: userRespQuesArr
    });

    User.findOne({"_id": userId},{forms: {$elemMatch: {_id: formId}}}, function(err, foundForm){
        if (!err){
            //form public or not is important here to accept response
            if(foundForm.forms[0].public === "on") {
                foundForm.forms[0].responses.push(userResponse);
                foundForm.save();
            }
            res.render("formOff", {form: foundForm.forms[0]});
        }else {
            console.log(err);
        }
    });
});


app.post("/register", function(req, res) {
    User.register({username: req.body.username, name: req.body.Name}, req.body.password, function(err, user) {
        if (err) { 
            console.log(err);
            res.redirect("/register");
        }else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/dashboard");
            });
        }
      });
});


app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err) {
        if(err) {
            console.log(err);
        }else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/dashboard");
            });
        }
    });

});


let port = process.env.PORT;
if(port == null || port == "") {
    port = 3000;
}
app.listen(port);
