import { authApi } from './auth-api';

export const getRefreshToken = async api => {
  await api.dispatch(authApi.endpoints.refreshToken.initiate()).unwrap();
};

export const logoutError = async api => {
  await api.dispatch(authApi.endpoints.sendLogout.initiate()).unwrap();
};
