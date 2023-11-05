import express, { Router } from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, query, where } from "firebase/firestore";
import config from "../config/firebase.config.js"
import multer from "multer";

const strComments = "Comments";

const router: Router = express.Router(express.json());
const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app);

//comments reference collection
const commentsRef = collection(db, strComments);
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
    const snapshot = await getDocs(commentsRef);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.send(list);
});

router.get('/:id', cors(), async (req, res) => {
    
    const postId = req.params.id
    const q = query(commentsRef, where('post_id', '==', postId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return res.status(404).send(`No comments yet.`)
    }

    const comments = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).send({ message: 'success', comments: comments });
});

router.post('/create', cors(), upload.single('file'), async (req, res) => {
    try {
        const docRef = await addDoc(commentsRef, {
          name: req.body.name,
          comment: req.body.comment,
          post_id: req.body.post_id
        });
        res.status(201).send({ message: `Comment created with ID: ${docRef.id}`});
    } catch (e) {
        console.error("Error adding document: ", e);
        res.status(500).send({ message: `Error: ${e}`});
    }
});

export default router;