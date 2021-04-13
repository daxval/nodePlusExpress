"use strict";


const mongoose = require("mongoose"),
    courseSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        items: [],
        maxStudents: {
            type: Number,
            default: 0,
            min: [0, 'Course can not have a negative num. of students']
        },
        cost: {
            type: Number,
            default: 0,
            min: [0, "Costs coujld not be negative values"]
        },
        zipCode: {
            type: Number,
            min: [10000, "Zip code too short"],
            max: 99999
        }
    }, {
        timestamps: true
    });

module.exports = mongoose.model("Course", courseSchema);