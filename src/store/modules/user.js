import { createSlice } from '@reduxjs/toolkit'
import {setToken, removeToken} from '@/utils/auth'
const userStore = createSlice({
  name: 'user',
  initialState: {
    token: '',
    userInfo: null
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      setToken(action.payload)
    },
    removeToken(state) {
      state.token = ''
      removeToken()
    }
  }
})

const {setToken: setUserToken} = userStore.actions


export {
  setUserToken
}
export default userStore.reducer