"use client";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { useLoadingStore } from "@/store/blogStore";

export default function RegisterForm(
  email: string,
  password: string,
  name: string,
) {
  const setLoading = useLoadingStore((state) => state.setLoading);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      await updateProfile(userCredential.user, { displayName: name });

      await fetch("api/auth/session", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
      close();
    }
  };

  return (
    <div>
      <h1>Register Form</h1>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
