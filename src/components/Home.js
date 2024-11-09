import React, { useState, useEffect } from 'react';
import './Home.css';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [marketOverview, setMarketOverview] = useState(null);
  const [topCryptos, setTopCryptos] = useState([]);
  const [marketSentiment, setMarketSentiment] = useState(null);

  // 模拟API调用，获取最新数据
  const fetchLatestData = () => {
    // 生成随机新闻
    const generateRandomNews = () => {
      const newsTopics = [
        t('Bitcoin price surges'),
        t('Ethereum announces new feature'),
        t('Ripple partners with major bank'),
        t('New crypto exchange opens'),
        t('Innovative blockchain application emerges')
      ];
      return newsTopics.map((title, index) => ({
        id: Date.now() + index,
        title,
        date: new Date().toISOString().split('T')[0]
      })).slice(0, 3); // 最新の3件のみ
    };

    // 生成随机市场概览数据
    const generateRandomMarketOverview = () => ({
      totalMarketCap: `${(Math.random() * 3 + 1).toFixed(1)} ${t('trillion dollars')}`,
      bitcoinDominance: `${(Math.random() * 20 + 30).toFixed(1)}%`,
      '24hVolume': `${(Math.random() * 1000 + 500).toFixed(0)} ${t('billion dollars')}`,
      vixIndex: (Math.random() * 30 + 10).toFixed(2),
      investorSentimentIndex: (Math.random() * 100).toFixed(2),
      tradingVolume: `${(Math.random() * 1000 + 5000).toFixed(0)} ${t('billion dollars')}`,
      ipoOversubscriptionRate: `${(Math.random() * 50 + 1).toFixed(1)} ${t('times')}`,
      stockBondValueRatio: (Math.random() * 2 + 0.5).toFixed(2),
      marginTradingBalance: `${(Math.random() * 1000 + 2000).toFixed(0)} ${t('billion dollars')}`,
    });

    setNews(generateRandomNews());
    setMarketOverview(generateRandomMarketOverview());

    // 模拟获取热门加密货币数据
    setTopCryptos([
      { name: 'Bitcoin', price: '$45,000', change: '+5.2%' },
      { name: 'Ethereum', price: '$3,200', change: '+3.7%' },
      { name: 'Cardano', price: '$2.1', change: '-1.2%' },
    ]);

    // 模拟获取市场情绪数据
    setMarketSentiment({ value: 65, status: t('Greedy') });
  };

  useEffect(() => {
    // 初回データ取得
    fetchLatestData();

    // 每30秒更新一次数据
    const intervalId = setInterval(fetchLatestData, 30000);

    // 清理函数
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="home-container">
      <h2>{t('Welcome to the Cryptocurrency Market')}</h2>
      
      <section className="market-overview">
        <h3>{t('Market Overview')}</h3>
        {marketOverview && (
          <ul>
            <li>{t('Total Market Cap')}: {marketOverview.totalMarketCap}</li>
            <li>{t('Bitcoin Dominance')}: {marketOverview.bitcoinDominance}</li>
            <li>{t('24h Volume')}: {marketOverview['24hVolume']}</li>
            <li>{t('VIX Index (Fear Index)')}: {marketOverview.vixIndex}</li>
            <li>{t('Investor Sentiment Index')}: {marketOverview.investorSentimentIndex}</li>
            <li>{t('Trading Volume')}: {marketOverview.tradingVolume}</li>
            <li>{t('IPO Oversubscription Rate')}: {marketOverview.ipoOversubscriptionRate}</li>
            <li>{t('Stock Bond Value Ratio')}: {marketOverview.stockBondValueRatio}</li>
            <li>{t('Margin Trading Balance')}: {marketOverview.marginTradingBalance}</li>
          </ul>
        )}
      </section>

      <section className="top-cryptos">
        <h3>{t('Top Cryptocurrencies')}</h3>
        <ul>
          {topCryptos.map(crypto => (
            <li key={crypto.name}>
              {crypto.name}: {crypto.price} ({crypto.change})
            </li>
          ))}
        </ul>
      </section>

      <section className="market-sentiment">
        <h3>{t('Market Sentiment')}</h3>
        <p>{t('Current Market Sentiment')}: {marketSentiment?.value} ({marketSentiment?.status})</p>
      </section>

      <section className="latest-news">
        <h3>{t('Latest News')}</h3>
        <ul>
          {news.map(item => (
            <li key={item.id}>
              <span>{item.date}</span> - {item.title}
            </li>
          ))}
        </ul>
      </section>

      <section className="education">
        <h3>{t('Educational Resources')}</h3>
        <ul>
          <li><a href="https://coincheck.com/ja/article/20" target="_blank" rel="noopener noreferrer">{t('Introduction to Cryptocurrency Guide')}</a></li>
          <li><a href="https://bitcoin.org/ja/how-it-works" target="_blank" rel="noopener noreferrer">{t('Basics of Blockchain')}</a></li>
          <li><a href="https://www.fsa.go.jp/policy/virtual_currency/index.html" target="_blank" rel="noopener noreferrer">{t('Safe Investment Methods')}</a></li>
        </ul>
      </section>
    </div>
  );
}

export default Home;