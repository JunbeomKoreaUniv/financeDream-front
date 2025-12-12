import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './News.css';

function News() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState('');

  // TODO: 외부 API 연동 시 이 함수 수정
  const fetchNews = async (stockName) => {
    setLoading(true);
    try {
      // 외부 뉴스 API 호출 예정
      // const response = await axios.get(`외부_API_URL?query=${stockName}`);
      // setNews(response.data);
      
      // 임시 더미 데이터
      setTimeout(() => {
        setNews([
          {
            id: 1,
            title: `${stockName} 관련 최신 뉴스 1`,
            description: '뉴스 내용이 여기에 표시됩니다. 외부 API 연동 후 실제 데이터로 대체됩니다.',
            source: '뉴스 출처',
            publishedAt: new Date().toISOString(),
            url: '#',
          },
          {
            id: 2,
            title: `${stockName} 시장 동향 분석`,
            description: '시장 동향에 대한 분석 기사입니다.',
            source: '경제신문',
            publishedAt: new Date().toISOString(),
            url: '#',
          },
          {
            id: 3,
            title: `${stockName} 투자 전망`,
            description: '전문가들의 투자 전망을 담은 기사입니다.',
            source: '투자저널',
            publishedAt: new Date().toISOString(),
            url: '#',
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('뉴스 조회 실패:', error);
      setLoading(false);
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    fetchNews(stock);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="news-container">
      <header className="news-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 돌아가기
        </button>
        <h1>뉴스 조회</h1>
      </header>

      <main className="news-content">
        <section className="stock-selector">
          <h3>종목 선택</h3>
          <div className="stock-buttons">
            {user.stocks && user.stocks.length > 0 ? (
              user.stocks.map((stock, index) => (
                <button
                  key={index}
                  onClick={() => handleStockClick(stock)}
                  className={`stock-select-btn ${selectedStock === stock ? 'active' : ''}`}
                >
                  {stock}
                </button>
              ))
            ) : (
              <p className="no-stocks">
                등록된 관심 종목이 없습니다.{' '}
                <button onClick={() => navigate('/stocks')} className="link-btn">
                  종목 추가하기
                </button>
              </p>
            )}
          </div>
        </section>

        <section className="news-list-section">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>뉴스를 불러오는 중...</p>
            </div>
          ) : selectedStock ? (
            <>
              <h3>📰 {selectedStock} 관련 뉴스</h3>
              {news.length > 0 ? (
                <ul className="news-list">
                  {news.map((item) => (
                    <li key={item.id} className="news-item">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                        <div className="news-meta">
                          <span className="source">{item.source}</span>
                          <span className="date">
                            {new Date(item.publishedAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-news">관련 뉴스가 없습니다.</p>
              )}
            </>
          ) : (
            <div className="select-prompt">
              <p>👆 위에서 종목을 선택하면 관련 뉴스와 과거 유사한 뉴스 정보와 주가 변동 데이터를 제공합니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default News;
