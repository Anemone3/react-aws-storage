import { useEffect, useRef } from "react";
import { useRefreshTokenMutation } from "../redux/services/auth-api";
import { useSelector } from "react-redux";

export const useAuthentication = () => {
  const hasRefreshed = useRef(false);

  const [refreshToken, { data, error, isLoading }] = useRefreshTokenMutation();

  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!hasRefreshed.current) {
      const checkAuth = async () => {
        console.log("Verificando Token");

        try {
          console.log(hasRefreshed);

          await refreshToken().unwrap();
        } catch (error) {
          console.error("Auth failed:", error);
        }
      };

      if (!accessToken) checkAuth();
    }

    return () => (hasRefreshed.current = true);
  }, []);

  return { data, isLoading, error };
};
