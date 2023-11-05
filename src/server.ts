import express, { Express } from "express";
import uploadRouter from "./controllers/upload-file.controller.js";
import postRouter from "./controllers/posts.controller.js";
import commentRouter from "./controllers/comments.controller.js";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
dotenv.config();

const app: Express = express();
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/upload', uploadRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
})