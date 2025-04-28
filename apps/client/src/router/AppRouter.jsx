import { Route, Routes } from 'react-router';
import SearchPage from '../pages/SearchPage';
import App from '../App';
import CollectionsPage from '../pages/CollectionsPage';
import AuthenticationRouter from './AuthenticationRouter';
import { lazy } from 'react';
import CollectionRouter from './CollectionRouter';

const GalleryPage = lazy(() => import('../pages/GalleryPage'));

function AppRouter() {
  return (
    <Routes>
      <Route element={<AuthenticationRouter />}>
        <Route element={<App />}>
          <Route index element={<SearchPage />} />
          <Route path="collections/*" element={<CollectionRouter />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<SearchPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
export default AppRouter;
