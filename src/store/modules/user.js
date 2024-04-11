import { createSlice } from '@reduxjs/toolkit'
import {setToken, removeToken} from '@/utils/auth'
import { getUserInfo } from '@/api/user';
const userStore = createSlice({
  name: 'user',
  initialState: {
    token: '',
    userInfo: {},
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      setToken(action.payload);
    },
    removeToken(state) {
      state.token = '';
      removeToken();
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
  },
});

const { setToken: setUserToken, setUserInfo } = userStore.actions;

const loadUserInfo = () => {
  return async (dispatch) => {
    const res = await getUserInfo();
    dispatch(setUserInfo(res.data.data));
  };
};

export { setUserToken, loadUserInfo };
export default userStore.reducer