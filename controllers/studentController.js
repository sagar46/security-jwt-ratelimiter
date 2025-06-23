const Student = require('../model/studentSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


// Signup controller - registers a new student
const signup = async (req, res) => {
    try {
        // Destructure signup request body
        const { username, name, password, email, address, course } = req.body;

        // Check if student already exists (by username or email)
        const userExistByUsername = await Student.findOne({ username });
        const userExistByEmail = await Student.findOne({ email });

        if (userExistByEmail || userExistByUsername) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password (you might want to pass saltRounds, e.g. bcrypt.hash(password, 10))
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the student in the database
        await Student.create({
            username,
            name,
            password: hashedPassword,
            email,
            address,
            course
        });

        // Respond with success
        res.status(201).json({ message: "Signup complete." });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


// Login controller - authenticates student and issues token
const login = async (req, res) => {
    try {
        // Destructure login request body
        const { username, email, password } = req.body;

        // Find student by username or email
        const student = await Student.findOne({
            $or: [{ username }, { email }]
        });

        if (!student) {
            return res.status(400).json({ message: 'Invalid student credentials' });
        }

        // Compare provided password with stored hashed password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid student credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { username: student.username, id: student._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Respond with token and student data (you may want to exclude password)
        res.status(200).json({
            token,
            data: {
                id: student._id,
                username: student.username,
                name: student.name,
                email: student.email,
                address: student.address,
                course: student.course
            },
            message: 'Login complete'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

 // Protected greetings endpoint
const greetings = async (req, res) => {
    res.json({
        data: 'Hello from Student greetings API',
        message: "Accessed protected route"
    });
};

module.exports = { signup, login, greetings };
