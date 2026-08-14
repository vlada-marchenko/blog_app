"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { useBlogStore } from "@/store/blogStore";
import Loader from "../Loader/Loader";
import { useForm } from "react-hook-form";
import css from "./LoginForm.module.css";
import { toast } from "sonner";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to log in. Check your email and password.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const { register, handleSubmit } = useForm<LoginFormValues>();

  if (isLoading) return <Loader />;

  return (
    <div className={css.login}>
      <h1 className={css.title}>Login Form</h1>
      <form onSubmit={handleSubmit(handleLogin)} className={css.form}>
        <label htmlFor="email" className={css.label}>
          Email
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className={css.input}
          />
        </label>
        <label htmlFor="pass" className={css.label}>
          Password
          <input
            {...register("password")}
            key="pass"
            type="password"
            placeholder="Create a password"
            className={css.input}
          />
        </label>
        <button type="submit" className={css.button}>
          Log in
        </button>
      </form>
    </div>
  );
}
