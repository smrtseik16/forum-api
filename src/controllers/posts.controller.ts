import express, { Router } from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import multer from "multer";
import config from "../config/firebase.config.js"
import giveCurrentDateTime from '../helpers/helpers.js'

const strPosts = "Posts";

const router: Router = express.Router(express.json());
const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();
// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

//posts reference collection
const postsRef = collection(db, strPosts);

router.get('/', async (req, res) => {
    const snapshot = await getDocs(postsRef);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
});

router.post('/create', upload.single("file"), async (req, res) => {
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/${req.file.originalname + "-" + dateTime}`);

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

    try {
        const docRef = await addDoc(postsRef, {
          name: req.body.name,
          description: req.body.description,
          image_url: downloadURL
        });
        res.status(201).send({ message: `Post created with ID: ${docRef.id}`});
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).send({ message: `Error: ${e}`});
    }
});

export default router;