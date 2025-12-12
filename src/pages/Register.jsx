import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api';
import './Auth.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });
  const [stocks, setStocks] = useState([]);
  const [stockInput, setStockInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addStock = () => {
    if (stockInput.trim() && !stocks.includes(stockInput.trim())) {
      setStocks((prev) => [...prev, stockInput.trim()]);
      setStockInput('');
    }
  };

  const removeStock = (stockToRemove) => {
    setStocks((prev) => prev.filter((stock) => stock !== stockToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStock();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm, 
        nickname: formData.nickname,
        stocks: stocks,
      });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>회원가입</h1>
          <p>뉴스 서비스에 가입하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>
            <input
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임 입력"
              required
            />
          </div>

          <div className="form-group">
            <label>관심 주식 종목</label>
            <div className="stock-input-wrapper">
              <input
                type="text"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="종목명 입력 후 Enter"
              />
              <button type="button" onClick={addStock} className="add-stock-btn">
                추가
              </button>
            </div>
            <div className="stock-tags">
              {stocks.map((stock) => (
                <span key={stock} className="stock-tag">
                  {stock}
                  <button type="button" onClick={() => removeStock(stock)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
