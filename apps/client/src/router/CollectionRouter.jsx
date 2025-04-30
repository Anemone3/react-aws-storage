import { Route, Routes } from 'react-router';
import CollectionsPage from '../pages/CollectionsPage';
import CollectionContent from '../components/CollectionContent';
import CollectionList from '../pages/CollectionList';

const CollectionRouter = () => {
  return (
    <Routes>
      <Route path=":userId" element={<CollectionsPage />}>
        <Route index element={<CollectionList />} />
        <Route path=":collectionId" element={<CollectionContent />} />
      </Route>
    </Routes>
  );
};
export default CollectionRouter;
