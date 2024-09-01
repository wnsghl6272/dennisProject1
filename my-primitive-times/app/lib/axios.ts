// app/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  withCredentials: true, // 쿠키를 포함하여 요청
});

export default instance;
