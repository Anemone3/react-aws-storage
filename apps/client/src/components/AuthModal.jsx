import { useState } from "react";
import { useModal } from "../hooks/useModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const AuthModal = () => {
  const { hideModal } = useModal();

  const [isLoggin, setIsLoggin] = useState(true);

  return (
    <div className="relative h-96 w-4xl bg-white">
      <button
        onClick={() => hideModal()}
        className="bg-primary-dark text-darkness absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-sm font-semibold"
      >
        X
      </button>
      <div className="flex h-full p-4">
        {isLoggin ? <LoginModal /> : <RegisterModal />}
        <div className="flex flex-1">Image</div>
      </div>
    </div>
  );
};

export default AuthModal;
