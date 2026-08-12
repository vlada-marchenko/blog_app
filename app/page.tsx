import css from "./page.module.css";
import BlogPage from "@/components/BlogPage/BlogPage";

export default function Home() {
  return (
    <div className={css.page}>
      <BlogPage />
    </div>
  );
}
