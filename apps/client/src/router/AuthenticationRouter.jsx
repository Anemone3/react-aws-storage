import { Outlet, useNavigate } from "react-router";
import { useAuthentication } from "../hooks/useAuthentication";

const AuthenticationRouter = () => {
  const { data, isLoading } = useAuthentication();

  /* Usarlo como protected Router */

  return <Outlet />;
};

export default AuthenticationRouter;
