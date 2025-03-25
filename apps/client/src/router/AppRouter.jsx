import { Route, Routes } from "react-router";
import SearchPage from "../pages/SearchPage";
import App from "../App";
import CollectionsPage from "../pages/CollectionsPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<SearchPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
      </Route>
    </Routes>
  );
}
export default AppRouter;
