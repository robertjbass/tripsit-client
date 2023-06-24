import { useContext } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { GlobalContext } from "@/context/GlobalContext";
const provider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: "AIzaSyA6qljMODHamWxgu5Ld30-M0Mp4c7WqJCc",
  authDomain: "tripsit-eb426.firebaseapp.com",
  projectId: "tripsit-eb426",
  storageBucket: "tripsit-eb426.appspot.com",
  messagingSenderId: "560578052483",
  appId: "1:560578052483:web:23a93ee39b3f95e5f4b6b6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const useFirebase = () => {
  const { setUser } = useContext(GlobalContext);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user: User = result.user;
      if (user) setUser(user);
      else throw new Error("No user");

      const { email, uid } = user;

      const docRef = doc(db, "users", email as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await setDoc(
          doc(db, "users", email as string),
          {
            lastLogin: new Date(),
          },
          { merge: true }
        );
      } else {
        await setDoc(doc(db, "users", email as string), {
          uid,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return { signIn, signOut };
};

export default useFirebase;

// FIREBASE DATA MODELING
// const users = [
//   {
//     "user@email.com": {
//       uid: "G2XSWj2IMGS3A3rEMcPw0WA3ZPX2",
//       createdAt: new Date(),
//       lastLogin: new Date(),
//     },
//   },
// ];
