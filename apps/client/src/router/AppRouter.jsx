import { Route, Routes } from 'react-router';
import SearchPage from '../pages/SearchPage';
import App from '../App';
import { lazy } from 'react';
import CollectionRouter from './CollectionRouter';
import { AuthenticateWrapper } from '../context/AuthenticateWrapper';

const GalleryPage = lazy(() => import('../pages/GalleryPage'));

function AppRouter() {
  return (
    <AuthenticateWrapper>
      <Routes>
        <Route element={<App />}>
          <Route index element={<SearchPage />} />
          <Route path="collections/*" element={<CollectionRouter />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<SearchPage />} />
        </Route>
      </Routes>
    </AuthenticateWrapper>
  );
}
export default AppRouter;
