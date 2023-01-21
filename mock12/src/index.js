const express = require('express');
const connect = require('./config/connect');
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
const User = require("./models/user.model");
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send({ 'mock12': 'Hello World!' });
});

app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            res.status(200).send({ message: "User Already Exist" });
        } else {
            let newuser = await User.create({ name, email, password });
            res.status(201).send({ message: "User Signup Successful", user: { name: newuser.name, email: newuser.email } });
        }
    } catch (error) {
        res.status(500).send({ message: "User Signup Failed Please Try Again" });
    }
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            let token = jwt.sign({ email, name: user.name }, process.env.JWT_SECRET);
            res.status(200).send({ message: "Login Successful", user: { name: user.name, email: user.email, token } });
        } else {
            res.status(401).send({ message: "Invalid Credentails" });
        }
    } catch (error) {
        res.status(401).send({ message: "Login Failed Please Try Again" });
    }
})

app.post("/getProfile", async (req, res) => {
    const { token } = req.body;
    try {
        let user = jwt.decode(token, process.env.JWT_SECRET);
        if (user) {
            res.status(200).send({ name: user.name, email: user.email, token });
        } else {
            res.status(401).send({ message: "Invalid Token" });
        }
    } catch (error) {
        res.status(500).send({ message: "Login Failed Please Try Again" });
    }
})

app.post("/calculate", async (req, res) => {
    let { P, I, N } = req.body;
    if (!I || !P || !N) {
        res.send({ message: "Please Provide Full Details" });
    }
    try {
        I = I / 100;
        let F = 100000 * ((((1 + 0.071) ** 15) - 1) / 0.071);
        res.status(200).send({ investment: Math.floor(P * N), maturity: Math.floor(F), gained: Math.floor(F - (P * N)) });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Login Failed Please Try Again" });
    }
})




app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});