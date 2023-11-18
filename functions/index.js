import express from "express";
import postRouter from "./controllers/posts.controller.js";
import commentRouter from "./controllers/comments.controller.js";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import functions from 'firebase-functions';
dotenv.config();
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(bodyParser.json());
app.get('/test', (req, res) => res.send('you did it mf!'));
app.use('/post', postRouter);
app.use('/comment', commentRouter);
// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//     console.log(`Server is listening at port ${port}`);
// })
export const api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map