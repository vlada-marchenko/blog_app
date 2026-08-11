"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/client";

export default function LoginForm(email: string, password: string) {
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      await fetch("/api/auth/session", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      close();
    }
  };

  return (
    <div>
      <h1>Login Form</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
