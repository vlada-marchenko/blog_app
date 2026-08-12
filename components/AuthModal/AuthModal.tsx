import RegisterForm from "../RegisterForm/RegisterForm";
import LoginForm from "../LoginForm/LoginForm";
import { useBlogStore } from "@/store/blogStore";
import { createPortal } from "react-dom";

export default function AuthModal() {
  const closeModal = useBlogStore((state) => state.close);
  const isOpenModal = useBlogStore((state) => state.isOpenModal);
  const modeModal = useBlogStore((state) => state.mode);

  if (!isOpenModal) return null;

  return createPortal(
    <div onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation}>
        {modeModal === "login" ? (
          <LoginForm onClose={closeModal} />
        ) : (
          <RegisterForm onClose={closeModal} />
        )}
      </div>
    </div>,
    document.body,
  );
}
