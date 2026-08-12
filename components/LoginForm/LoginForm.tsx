"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { useBlogStore } from "@/store/blogStore";
import Loader from "../Loader/Loader";
import { useForm } from "react-hook-form";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onClose: () => void;
};

export default function LoginForm({ onClose }: LoginFormProps) {
  const isLoading = useBlogStore((state) => state.isLoading);
  const setLoading = useBlogStore((state) => state.setLoading);

  const handleLogin = async ({ email, password }: LoginFormValues) => {
    setLoading(true);
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
      setLoading(false);
      onClose();
    }
  };

  const { register, handleSubmit } = useForm<LoginFormValues>();

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit(handleLogin)}>
        <label htmlFor="email">
          Email
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
          />
        </label>
        <label htmlFor="pass">
          Password
          <input
            {...register("password")}
            key="pass"
            type="password"
            placeholder="Create a password"
          />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
