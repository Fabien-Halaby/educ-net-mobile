import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveAuth = async (token: string, user: any) => {
  await AsyncStorage.multiSet([
    ['access_token', token],
    ['user', JSON.stringify(user)],
  ]);
};

export const getToken = async () => {
  return AsyncStorage.getItem('access_token');
};

export const getUser = async () => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = async () => {
  const token = await AsyncStorage.getItem('access_token');
  console.log("TOKEN: ", !!token)
  return !!token;
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['access_token', 'user']);
};
