import { useEffect, useRef } from "react";
import { useRefreshTokenMutation } from "../redux/services/auth-api";

export const useAuth = () => {
  const [refreshToken, { data,error,isLoading }] = useRefreshTokenMutation();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!hasRefreshed.current) {
          await refreshToken().unwrap();
        }
      } catch (error) {
        console.error('Auth failed:', error);
      } finally {
        hasRefreshed.current = true;
      }
    };
    
    checkAuth();
  }, []);

  return { data,isLoading,error };
};
