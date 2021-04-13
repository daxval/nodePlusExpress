const {
    cookie
} = require("express-validator");
const usersController = require("./controllers/usersController");
const course = require("./models/course");
const subscriber = require("./models/subscriber");

const express = require("express"),
    router = express.Router(),
    app = express(),
    homeController = require("./controllers/homeController"),
    errorController = require("./controllers/errorController"),
    subscribersController = require("./controllers/subscriberController"),
    courseController = require("./controllers/coursesController"),
    methodOverride = require("method-override"),
    layouts = require("express-ejs-layouts"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    cookieParser = require("cookie-parser"),
    expressSession = require("express-session"),
    expressValidator = require("express-validator"),
    connectFlash = require("connect-flash"),
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {
    useNewUrlParser: true
});

app.set("port", process.env.PORT || 3000);


router.use(
    methodOverride("_method", {
        methods: ["POST", "GET"]
    })
);

router.use(layouts);
router.use(express.static("public"));
router.use(expressValidator());


router.use(express.json());

router.use(cookieParser("my_passcode"));
router.use(expressSession({
    secret: "my_passcode",
    cookie: {
        maxAge: 360000
    },
    resave: false,
    saveUninitialized: false,
}));

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.deserializeUser(User.deserializeUser);
passport.serializeUser(User.serializeUser);
router.use(connectFlash());

app.set("view engine", "ejs");

router.use(express.static("public"));
router.use(layouts);
router.use(
    express.urlencoded({
        extended: false
    })
);
router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    res.locals.loggedIn = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
});

router.use(expressValidator());

router.get("/", homeController.index);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);

router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.get("/users/logout", usersController.logout, usersController.redirectView);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.validate, usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/courses", courseController.index, courseController.indexView);
router.get("/courses/new", courseController.new);
router.post("/courses/create", courseController.create, courseController.redirectView);
router.get("/courses/:id", courseController.show, courseController.showView);
router.get("/courses/:id/edit", courseController.edit);
router.put("/courses/:id/update", courseController.update, courseController.redirectView);
router.delete("/courses/:id/delete", courseController.delete, courseController.redirectView);

//app.use(errorController.logErrors);
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`)
});