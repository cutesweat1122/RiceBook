import { configureStore, combineReducers } from '@reduxjs/toolkit'
import curUserReducer from './features/users/curUserSlice'

const rootReducer = combineReducers({
  curUser: curUserReducer,
})

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}
