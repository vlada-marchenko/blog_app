import RegisterForm from "../RegisterForm/RegisterForm";
import LoginForm from "../LoginForm/LoginForm";
import { useBlogStore } from "@/store/blogStore";
import { createPortal } from "react-dom";
import css from "./AuthModal.module.css";

export default function AuthModal() {
  const closeAuthModal = useBlogStore((state) => state.closeModal);
  const activeModal = useBlogStore((state) => state.activeModal);
  const modeModal = useBlogStore((state) => state.mode);

  if (activeModal !== "auth") return null;

  return createPortal(
    <div onClick={closeAuthModal} className={css.overlay}>
      <div onClick={(e) => e.stopPropagation()} className={css.modal}>
        <button
          type="button"
          className={css.closeButton}
          onClick={closeAuthModal}
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 5L15 15M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        {modeModal === "login" ? (
          <LoginForm onClose={closeAuthModal} />
        ) : (
          <RegisterForm onClose={closeAuthModal} />
        )}
      </div>
    </div>,
    document.body,
  );
}
