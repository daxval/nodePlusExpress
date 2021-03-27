const Subscriber = require(".../models/subscriber");
const subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res) => {
    subscriber.find({})
    .exec()
    .then(subscribers => {
        res.render("subscribers",{subscribers: subscribers})
    })
    .catch((error) => {
        console.log(error);
        return [];
    })
    .then(() => {
        console.log("promise complete");
    })
};

exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};

exports.saveSubscriber = (req, res) => {
    let newSubscriber = new subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });
    newSubscriber.save()
    .then(() => {
        res.render("thanks");
    })
    .catch(error => { res.send(error)});
}