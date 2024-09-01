'use client';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Auth 상태 인터페이스 정의
interface AuthState {
  isLogin: boolean;
}

// 초기 상태 설정
const initialState: AuthState = {
  isLogin: false,
};

// authSlice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.isLogin = false;
    },
  },
});

// 스토어 생성
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// 타입 추론을 위한 export
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 커스텀 훅 생성
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 액션 export
export const { login, logout } = authSlice.actions;

export default store;
