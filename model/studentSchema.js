const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true, 
        trim: true
    },
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    email: {
        type: String,
        required: [true, "Email is required."],
    },
    address: {
        type: String,
    },
    course: {
        type: String,
    }
}, {
    timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
