import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import config from "../config/firebase.config.js";
import multer from "multer";
import { filesUpload } from "./middleware.js";
import { giveCurrentDateTime, sortedAsc, sortedDesc, getDateTimeTZ} from '../helpers/helpers.js'
const strPosts = "Posts";
const router = express.Router();
const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();
// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });
//posts reference collection
const postsRef = collection(db, strPosts);
router.get('/:asc?', cors(), async (req, res) => {
    const snapshot = await getDocs(postsRef);
    const isAsc = req.params.asc == 'asc' ? req.params.asc : false;
    var list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send((isAsc) ? sortedAsc(list) : sortedDesc(list));
});
router.post('/create', cors(), filesUpload, async (req, res) => {
    try {
        console.log('request file: ', req.files, req.body);
        req.file = req.files[0];
        const dateTime = giveCurrentDateTime();
        var dateTimeNow = getDateTimeTZ();
        var fileName = (typeof req.file !== "undefined") ? req.file.originalname  : 'image-file';
        const storageRef = ref(storage, `files/${fileName + "-" + dateTime}`);
        // Create file metadata including the content type
        const metadata = {
            contentType: req.file.mimetype,
        };
        // Upload the file in the bucket storage
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel
        // Grab the public url
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File successfully uploaded.');
        const docRef = await addDoc(postsRef, {
          name: req.body.name,
          description: req.body.description,
          image_url: downloadURL,
          date_created: dateTimeNow
        });
        res.status(201).send({ message: `Post created with ID: ${docRef.id}`});
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).send({ message: `Error: ${e}`});
    }
});
export default router;
//# sourceMappingURL=posts.controller.js.map