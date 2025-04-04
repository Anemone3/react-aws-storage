import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
import { ModalProvider } from "./context/ModalProvider";

function App() {
  return (
    <ModalProvider>
      <div className="flex max-w-screen flex-col divide-y">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </ModalProvider>
  );
}

export default App;
