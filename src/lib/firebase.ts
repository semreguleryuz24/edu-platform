import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvjaeGXSFiG5ukouRidn5t0iiTdisWb54",
  authDomain: "edu-platform-27a17.firebaseapp.com",
  projectId: "edu-platform-27a17",
  storageBucket: "edu-platform-27a17.firebasestorage.app",
  messagingSenderId: "77254498501",
  appId: "1:77254498501:web:3af07a3d218c0717b878ac",
  measurementId: "G-W8D6HZDK9R",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Offline desteğini aktif et
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.log("Persistence failed: multiple tabs open");
    } else if (err.code === "unimplemented") {
      console.log("Persistence is not available in this browser");
    }
  });
}
