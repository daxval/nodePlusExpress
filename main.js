const express = require("express"),
    layouts = require("express-ejs-layouts"),
    app = express(),
    router = require("./routes/index"),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscribersController"),
    usersController = require("./controllers/usersController"),
    courseController = require("./controllers/coursesController"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    expressValidator = require("express-validator"),
    connectFlash = require("connect-flash"),
    course = require("./models/course"),
    subscriber = require("./models/subscriber"),
    User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {
    useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});
app.set("port", process.env.PORT || 3000);


app.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);

app.use(express.static("public"));
app.use(layouts);
app.use(expressValidator());


app.use(express.json());

app.use(cookieParser("my_passcode"));
app.use(expressSession({
    secret: "my_passcode",
    cookie: {
        maxAge: 360000
    },
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.deserializeUser(User.deserializeUser);
passport.serializeUser(User.serializeUser);
app.use(connectFlash());

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(layouts);
app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

app.use(expressValidator());


app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`)
});