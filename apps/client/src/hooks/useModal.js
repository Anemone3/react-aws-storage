import { useContext } from "react";
import { ModalContext } from "../context/ModalProvider";

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
