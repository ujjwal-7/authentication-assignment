const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectToDb = require('./db/index.js');
const authRouter = require('./routers/auth.router.js');
const userRouter = require('./routers/user.router.js')

const app = express();
const PORT = process.env.PORT;

connectToDb();

app.use(cors());
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use('*', (req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});