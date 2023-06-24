import { useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
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

const useFirebase = () => {
  const { setUser } = useContext(GlobalContext);
  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);
  const db = getFirestore(app);
  console.log(typeof db);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) setUser(user);
      else throw new Error("No user");
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
