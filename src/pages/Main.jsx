import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Main.css';

function Main() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="main-container">
      <header className="main-header">
        <h1 className="logo">📰 금융드림팀</h1>
        <button onClick={handleLogout} className="logout-btn">
          로그아웃
        </button>
      </header>

      <main className="main-content">
        <section className="user-info-card">
          <div className="user-avatar">
            {(user.nickName || user.nickname)?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h2>{user.nickName || user.nickname}</h2>
            <p className="user-email">{user.email}</p>
            {user.createdAt && (
              <p className="user-joined">
                가입일: {new Date(user.createdAt).toLocaleDateString('ko-KR')}
              </p>
            )}
          </div>
        </section>

        <section className="stocks-section">
          <h3>📈 내 관심 종목</h3>
          <div className="stock-list">
            {user.stocks && user.stocks.length > 0 ? (
              user.stocks.map((stock, index) => (
                <span key={index} className="stock-chip">
                  {stock}
                </span>
              ))
            ) : (
              <p className="no-stocks">등록된 관심 종목이 없습니다.</p>
            )}
          </div>
        </section>

        <section className="action-buttons">
          <button
            onClick={() => navigate('/stocks')}
            className="action-btn stocks-btn"
          >
            <span className="btn-icon">⚙️</span>
            <span className="btn-text">내 종목 수정</span>
          </button>
          <button
            onClick={() => navigate('/news')}
            className="action-btn news-btn"
          >
            <span className="btn-icon">📰</span>
            <span className="btn-text">뉴스 조회</span>
          </button>
        </section>
      </main>
    </div>
  );
}

export default Main;