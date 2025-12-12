import axios from 'axios';

const API_BASE_URL = 'https://api.financedream.store';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 설정 함수
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// 앱 시작 시 저장된 토큰 복원
const savedToken = localStorage.getItem('token');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

// 인증 관련 API
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/api/auth/register', {
      email: data.email,
      password: data.password,
      confirmPassword: data.passwordConfirm,
      nickName: data.nickname,
      stocks: data.stocks,
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      email,
      password,
    });
    // 헤더에서 토큰 추출해서 저장
    const token = response.headers['authorization'];
    if (token) {
      setAuthToken(token);
    }
    return response.data;
  },

  updateMember: async (data) => {
    const response = await api.put('/api/auth', {
      stocks: data.stocks,
    });
    return response.data;
  },
};

export const memberAPI = {
  getMyInfo: async () => {
    const response = await api.get('/api/members/me');
    return response.data;
  },
};

export default api;