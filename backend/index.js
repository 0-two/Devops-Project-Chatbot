import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import chatbotRoutes from './routes/chatbot.route.js'

const app = express();
dotenv.config()

const port = process.env.PORT || 3000;

app.use(express.json())

//Database connection code
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB")
}).catch((error) => {
    console.log("Error connecting to MongoDB", error)
})

// Defining Routes
/*
Source - https://stackoverflow.com/a/64155257
Posted by Ibad Shaikh, modified by community. See post 'Timeline' for change history
Retrieved 2026-07-23, License - CC BY-SA 4.0
*/

app.use("/bot/v1/", chatbotRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});