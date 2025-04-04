import { Route, Routes } from "react-router";
import SearchPage from "../pages/SearchPage";
import App from "../App";
import CollectionsPage from "../pages/CollectionsPage";
import { useAuth } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearAuthenticate, setAuthenticate } from "../redux/features/auth-slice";

function AppRouter() {
  const { data,error } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(
        setAuthenticate({ user: data.data, accessToken: data.accessToken }),
      );
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      dispatch(
        clearAuthenticate(),
      );
    }
  }, [error]);

  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<SearchPage />} />
        <Route path="/collections/:userId" element={<CollectionsPage />} />
      </Route>
    </Routes>
  );
}
export default AppRouter;
