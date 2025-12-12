import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';
import useAuthStore from '../store/authStore';
import './Stocks.css';

function Stocks() {
  const navigate = useNavigate();
  const { user, updateStocks } = useAuthStore();
  const [stocks, setStocks] = useState(user?.stocks || []);
  const [stockInput, setStockInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addStock = () => {
    if (stockInput.trim() && !stocks.includes(stockInput.trim())) {
      setStocks((prev) => [...prev, stockInput.trim()]);
      setStockInput('');
      setError('');
    } else if (stocks.includes(stockInput.trim())) {
      setError('이미 추가된 종목입니다.');
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

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authAPI.updateMember({ stocks });
      updateStocks(stocks);
      setSuccess('관심 종목이 저장되었습니다!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="stocks-container">
      <header className="stocks-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 돌아가기
        </button>
        <h1>관심 종목 수정</h1>
      </header>

      <main className="stocks-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="stock-input-section">
          <label>새 종목 추가</label>
          <div className="stock-input-wrapper">
            <input
              type="text"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="종목명 입력 후 Enter"
            />
            <button onClick={addStock} className="add-btn">
              추가
            </button>
          </div>
        </div>

        <div className="current-stocks">
          <h3>현재 관심 종목 ({stocks.length}개)</h3>
          {stocks.length > 0 ? (
            <ul className="stock-list">
              {stocks.map((stock, index) => (
                <li key={index} className="stock-item">
                  <span className="stock-name">{stock}</span>
                  <button
                    onClick={() => removeStock(stock)}
                    className="remove-btn"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-message">등록된 관심 종목이 없습니다.</p>
          )}
        </div>

        <button
          onClick={handleSave}
          className="save-btn"
          disabled={loading}
        >
          {loading ? '저장 중...' : '변경사항 저장'}
        </button>
      </main>
    </div>
  );
}

export default Stocks;
