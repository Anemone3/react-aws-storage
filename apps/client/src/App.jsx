import { Outlet } from 'react-router';
import Navbar from './components/Navbar';
import { ModalProvider } from './context/ModalProvider';
import { Toaster } from 'sonner';

function App() {
  return (
    <ModalProvider>
      <div className="flex max-w-screen flex-col divide-y">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <Toaster />
    </ModalProvider>
  );
}

export default App;
