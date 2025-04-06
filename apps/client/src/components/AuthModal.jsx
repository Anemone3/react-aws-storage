import { useState } from "react";
import { useModal } from "../hooks/useModal";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { X } from "lucide-react";

const AuthModal = () => {
  const { hideModal } = useModal();

  const [isLoggin, setIsLoggin] = useState(true);

  const onToggleForm = () => {
    setIsLoggin(!isLoggin);
  };

  const onClose = () => {
    hideModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 rounded-full bg-white p-1.5 text-gray-400 shadow-lg transition-colors hover:text-gray-600 hover:shadow-xl"
        >
          <X size={20} />
        </button>

        <div className="overflow-hidden rounded-lg border border-gray-100 bg-gradient-to-b from-white to-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="space-y-8 p-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-medium tracking-tight text-gray-900">
                {isLoggin
                  ? "Iniciar sesión en tu cuenta"
                  : "Crear una cuenta nueva"}
              </h2>
              <p className="text-sm text-gray-500">
                {isLoggin
                  ? "Ingresa tus credenciales para continuar"
                  : "Completa tu información para comenzar"}
              </p>
            </div>
            {isLoggin ? <LoginModal /> : <RegisterModal />}
            <button
              onClick={onToggleForm}
              className="w-full cursor-pointer text-center text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              {isLoggin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
