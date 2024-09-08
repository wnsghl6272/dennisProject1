// app/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  withCredentials: true, // axios를 사용할 때, 쿠키를 포함한 요청을 보내기 위해 withCredentials 옵션을 설정
});

export default instance;
