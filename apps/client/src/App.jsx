import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex max-w-screen flex-col divide-y">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
