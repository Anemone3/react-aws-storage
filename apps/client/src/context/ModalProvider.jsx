import { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalComponent, setModalComponent] = useState(null);

  const showModal = (component) => {
    if (!component) return;

    setModalComponent(component);
  };

  const hideModal = () => {
    if (modalComponent) setModalComponent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalComponent && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-secondary pointer-events-none absolute inset-0 opacity-55"></div>
          {modalComponent}
        </div>
      )}
    </ModalContext.Provider>
  );
};
