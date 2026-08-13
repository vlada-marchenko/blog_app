"use client";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase/client";
import { useBlogStore } from "@/store/blogStore";
import Loader from "../Loader/Loader";
import { useForm } from "react-hook-form";
import css from "./RegisterForm.module.css";

type RegisterFormValues = {
  email: string;
  password: string;
  name: string;
};

type RegisterFormProps = {
  onClose: () => void;
};

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const isLoading = useBlogStore((state) => state.isLoading);
  const setLoading = useBlogStore((state) => state.setLoading);

  const handleRegister = async ({
    email,
    password,
    name,
  }: RegisterFormValues) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      await updateProfile(userCredential.user, { displayName: name });

      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
    } catch (error) {
      console.error("Error registering:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const { register, handleSubmit } = useForm<RegisterFormValues>();

  if (isLoading) return <Loader />;

  return (
    <div className={css.register}>
      <h1 className={css.title}>Register Form</h1>
      <form onSubmit={handleSubmit(handleRegister)} className={css.form}>
        <label htmlFor="name" className={css.label}>
          Name
          <input
            {...register("name")}
            key="name"
            type="text"
            placeholder="Enter your name"
            className={css.input}
          />
        </label>
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
          Register
        </button>
      </form>
    </div>
  );
}
