import { db } from "../plugins/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

export const addUrlToAnalysedLinks = async (url, urlStats) => {
  const documentId = url.replace(/\//g, "-");

  const collectionRef = collection(db, "analysedLinks");
  const documentRef = doc(collectionRef, documentId);

  await setDoc(documentRef, {
    id: documentId,
    urlStats,
    created_at: serverTimestamp(),
  });
};

// const documentId = url.replace(/-/g, "/");

export const checkIfUrlIsAnalysed = async (url) => {
  const documentId = url.replace(/\//g, "-");

  const collectionRef = collection(db, "analysedLinks");
  const documentRef = doc(collectionRef, documentId);

  const documentSnapshot = await getDoc(documentRef);

  if (documentSnapshot.exists()) {
    const documentData = documentSnapshot.data();
    return { exists: true, data: documentData };
  } else {
    return { exists: false, data: null };
  }
};
