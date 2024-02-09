import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  username: '',
  headline: '',
  avatar: '',
  email: '',
  phone: '',
  dob: '',
  zipcode: '',
}

export const curUserSlice = createSlice({
  name: 'curUser',
  initialState,
  reducers: {
    setCurUser: (state, action) => {
      return action.payload
    },
    setProfile: (state, action) => {
      return { ...state, ...action.payload }
    },
    delCurUser: (state, action) => {
      return initialState
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCurUser, setProfile, delCurUser } = curUserSlice.actions

export default curUserSlice.reducer
