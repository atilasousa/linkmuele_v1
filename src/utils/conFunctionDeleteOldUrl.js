import { db } from "../firebase";
import { collection } from "firebase/firestore";

const deleteOldUrl = async () => {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const collectionRef = collection(db, "analysedLinks");
  const querySnapshot = await collectionRef
    .where("createdAt", "<", oneMonthAgo)
    .get();

  const batch = db.batch();

  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
};

deleteOldUrl();
