const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const studentRoutes = require('./routers/studentRoutes');


const app = express();
app.use(express.json())

app.use('/api/student', studentRoutes)

app.listen(process.env.PORT, process.env.HOSTNAME, ()=>{
    console.log(`Server started at ${process.env.HOSTNAME}:${process.env.PORT}`);
})

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Database connection successful!');
    })
    .catch((err) => {
        console.error(err);
        console.log('Database connection failed!');
    });