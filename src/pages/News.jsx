import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api';
import './News.css';

function News() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState('');
  const [expandedNews, setExpandedNews] = useState(null);

  const fetchNews = async (stockName) => {
    setLoading(true);
    setExpandedNews(null);
    try {
      const response = await api.post('/api/events/news-with-past-data', {
        stocks: [stockName]
      });
      console.log('뉴스 응답:', response.data);
      setNewsData(response.data);
    } catch (error) {
      console.error('뉴스 조회 실패:', error);
      setNewsData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    fetchNews(stock);
  };

  const toggleExpand = (index) => {
    setExpandedNews(expandedNews === index ? null : index);
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.2) return { text: '긍정', className: 'positive' };
    if (sentiment < -0.2) return { text: '부정', className: 'negative' };
    return { text: '중립', className: 'neutral' };
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('ko-KR') + '원';
  };

  const getPriceChange = (priceWindow) => {
    if (!priceWindow || priceWindow.length === 0) return null;
    const first = priceWindow[0];
    const change = first.close - first.open;
    const changePercent = ((change / first.open) * 100).toFixed(2);
    return {
      change,
      changePercent,
      isPositive: change >= 0
    };
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const newsResults = newsData?.news?.events?.results || [];
  const similarNewsArray = newsData?.similarNews || [];

  return (
    <div className="news-container">
      <header className="news-header">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 돌아가기
        </button>
        <h1>📰 뉴스 조회</h1>
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
          ) : selectedStock && newsResults.length > 0 ? (
            <>
              <h3>📈 {selectedStock} 관련 최신 뉴스</h3>
              <div className="news-cards">
                {newsResults.map((news, index) => {
                  const sentiment = getSentimentLabel(news.sentiment);
                  const similarNews = similarNewsArray[index];
                  const isExpanded = expandedNews === index;
                  const hasSimilarNews = similarNews?.items?.length > 0;

                  return (
                    <div key={news.uri} className="news-card">
                      <div className="news-main">
                        <div className="news-card-header">
                          <span className={`sentiment-badge ${sentiment.className}`}>
                            {sentiment.text}
                          </span>
                          <span className="news-date">{formatDate(news.eventDate)}</span>
                        </div>
                        <h4 className="news-title">{news.title.eng}</h4>
                        <p className="news-summary">{news.summary.eng}</p>
                        <div className="news-meta">
                          <span className="article-count">📄 관련 기사 {news.totalArticleCount}개</span>
                        </div>
                        
                        {hasSimilarNews && (
                          <button 
                            className="expand-btn"
                            onClick={() => toggleExpand(index)}
                          >
                            {isExpanded ? '유사 뉴스 접기 ▲' : '과거 유사 뉴스 보기 ▼'}
                          </button>
                        )}
                      </div>

                      {isExpanded && hasSimilarNews && (
                        <div className="similar-news-section">
                          <h5>🔍 과거 유사 뉴스</h5>
                          {similarNews.items.map((item, idx) => {
                            const priceData = similarNews.top_price_window?.[idx] || similarNews.top_price_window?.[0];
                            const priceChange = getPriceChange([priceData]);

                            return (
                              <div key={item.id || idx} className="similar-news-item">
                                <div className="similar-news-content">
                                  <span className="similar-date">{formatDate(item.event_date)}</span>
                                  <h6>{item.title}</h6>
                                  <p>{item.summary}</p>
                                  <span className="distance-badge">
                                    유사도: {(100 - (item.distance * 10)).toFixed(1)}%
                                  </span>
                                </div>
                                
                                {priceData && (
                                  <div className="price-window">
                                    <h6>📊 당시 주가 변동</h6>
                                    <div className="price-grid">
                                      <div className="price-item">
                                        <span className="price-label">시가</span>
                                        <span className="price-value">{formatPrice(priceData.open)}</span>
                                      </div>
                                      <div className="price-item">
                                        <span className="price-label">고가</span>
                                        <span className="price-value high">{formatPrice(priceData.high)}</span>
                                      </div>
                                      <div className="price-item">
                                        <span className="price-label">저가</span>
                                        <span className="price-value low">{formatPrice(priceData.low)}</span>
                                      </div>
                                      <div className="price-item">
                                        <span className="price-label">종가</span>
                                        <span className="price-value">{formatPrice(priceData.close)}</span>
                                      </div>
                                    </div>
                                    {priceChange && (
                                      <div className={`price-change ${priceChange.isPositive ? 'up' : 'down'}`}>
                                        {priceChange.isPositive ? '▲' : '▼'} {Math.abs(priceChange.change).toLocaleString()}원 
                                        ({priceChange.isPositive ? '+' : ''}{priceChange.changePercent}%)
                                      </div>
                                    )}
                                    <div className="volume">
                                      거래량: {priceData.volume?.toLocaleString()}주
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="pagination-info">
                총 {newsData?.news?.events?.totalResults}개 뉴스 중 {newsResults.length}개 표시
              </div>
            </>
          ) : selectedStock ? (
            <div className="no-news">
              <p>📭 {selectedStock} 관련 뉴스가 없습니다.</p>
            </div>
          ) : (
            <div className="select-prompt">
              <p>👆 위에서 종목을 선택하면 관련 뉴스를 조회합니다.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default News;