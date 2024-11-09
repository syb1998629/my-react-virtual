/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
/* eslint-enable no-unused-vars */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getUserData, updateUserData, getAllUsers } from './userDatabase';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Market.css';
/* eslint-disable no-unused-vars */

function Market() {
  const [currencies, setCurrencies] = useState([
    { id: 1, name: 'ビットコイン', symbol: 'BTC', price: 40000, change: 2.5 },
    { id: 2, name: 'イーサリアム', symbol: 'ETH', price: 2800, change: -1.2 },
    { id: 3, name: 'リップル', symbol: 'XRP', price: 0.75, change: 0.8 },
    { id: 4, name: 'カルダノ', symbol: 'ADA', price: 1.2, change: 3.7 },
    { id: 5, name: 'ドージコイン', symbol: 'DOGE', price: 0.25, change: -0.5 },
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [portfolio, setPortfolio] = useState({});
  const [balance, setBalance] = useState(500000);
  const [amount, setAmount] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [news, setNews] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [autoTrades, setAutoTrades] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [language, setLanguage] = useState('ja');
  const [fee] = useState(0.001); // 0.1% fee
  const [wallet, setWallet] = useState({});
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const username = localStorage.getItem('currentUser');
    if (username) {
      const userData = getUserData(username);
      if (userData) {
        setCurrentUser(username);
        setPortfolio(userData.portfolio || {});
        setBalance(userData.balance || 500000);
      }
    }
  }, []);

  // Update currency prices periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrencies(prevCurrencies => prevCurrencies.map(currency => ({
        ...currency,
        price: currency.price * (1 + (Math.random() - 0.5) * 0.02),
        change: (Math.random() - 0.5) * 10
      })));
      if (selectedCurrency) {
        setPriceHistory(prevHistory => {
          const newPrice = selectedCurrency.price * (1 + (Math.random() - 0.5) * 0.02);
          const newEntry = { time: new Date().toLocaleTimeString(), price: newPrice };
          return [...prevHistory.slice(-19), newEntry];
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);

  
// Update user data when portfolio or balance changes
useEffect(() => {
    if (currentUser) {
      updateUserData(currentUser, portfolio, balance);
    }
}, [currentUser, portfolio, balance]);

// Generate random news headlines periodically
useEffect(() => {
    const newsInterval = setInterval(() => {
      setNews(prevNews => [...prevNews, generateRandomNews()]);
    }, 30000);
  
    // Update leaderboard periodically
    const leaderboardInterval = setInterval(updateLeaderboard, 60000);
  
    return () => {
      clearInterval(newsInterval);
      clearInterval(leaderboardInterval);
    };
}, []);

const generateRandomNews = () => {
  const headlines = [
      "ビットコイン、新たな高値を記録", // 比特币创下新高
      "イーサリアム2.0の展開が加速", // 以太坊2.0部署加速
      "リップル、新たな銀行パートナーシップを発表", // 瑞波宣布新的银行合作伙伴关系
      "規制当局、仮想通貨取引所の監視を強化", // 监管机构加强对加密货币交易所的监管
      "機関投資家、仮想通貨への投資を増加", // 机构投资者增加对加密货币的投资
      "ビットコインのハッシュレート、過去最高を更新", // 比特币算力创历史新高
      "大手テック企業、ブロックチェーン部門を拡大", // 大型科技公司扩大区块链部门
      "NFTマーケットプレイス、取引量が急増", // NFT市场交易量激增
      "中央銀行、デジタル通貨の試験運用を開始", // 中央银行开始试行数字货币
      "仮想通貨のカーボンフットプリント、議論が活発化", // 加密货币碳足迹引发热议
      "ステーブルコイン規制案、議会で審議へ", // 稳定币监管提案将在国会审议
      "大手決済企業、仮想通貨サービスを拡充", // 大型支付公司扩展加密货币服务
      "仮想通貨ETF、新たに承認される", // 新的加密货币ETF获批
      "ビットコインマイニング、再生可能エネルギーの利用が増加", // 比特币挖矿增加使用可再生能源
      "DeFiプロトコル、総ロック価値が新記録", // DeFi协议总锁定价值创新高
      "ブロックチェーン技術、サプライチェーン管理での採用が拡大", // 区块链技术在供应链管理中的应用扩大
      "仮想通貨取引所、セキュリティ強化に大型投資", // 加密货币交易所大规模投资加强安全性
      "各国中央銀行、CBDCに関する国際協力を強化", // 各国央行加强CBDC国际合作
      "仮想通貨関連の求人、急増傾向に", // 加密货币相关职位需求激增
      "メタバースプロジェクト、仮想通貨との連携を強化", // 元宇宙项目加强与加密货币的整合
      "新しい暗号資産、ICOで成功裏に資金調達", // 新的加密资产在ICO中成功筹资
      "仮想通貨市場、ボラティリティが再び上昇中", // 加密货币市场波动性再次上升
      "デジタルアート市場、NFTによる革命が進行中", // 数字艺术市场正在经历NFT革命
      "アメリカ合衆国、仮想通貨税制改革を検討中"  // 美国考虑加密货币税制改革
  ];
  
  return {
    id: Date.now(),
    headline: headlines[Math.floor(Math.random() * headlines.length)],
    timestamp: new Date().toLocaleString()
  };
};

const updateLeaderboard = () => {
    const allUsers = getAllUsers();
    const sortedUsers = allUsers.sort((a, b) => b.balance - a.balance);
    setLeaderboard(sortedUsers.slice(0, 10));
};

const addTradeToHistory = (trade) => {
    setTradeHistory(prevHistory => [...prevHistory, trade]);
};

const calculatePortfolioValue = () => {
    return Object.entries(portfolio).reduce((total, [symbol, amount]) => {
      const currency = currencies.find(c => c.symbol === symbol);
      return total + (currency ? currency.price * amount : 0);
    }, 0);
};

const buyCurrency = (currency, amount) => {
    const cost = currency.price * parseFloat(amount);
    const feeAmount = cost * fee;
  
    if (cost + feeAmount <= balance) {
      // Update balance and portfolio
      setBalance(prevBalance => prevBalance - cost - feeAmount);
  
      // Add to portfolio
      setPortfolio(prevPortfolio => ({
        ...prevPortfolio,
        [currency.symbol]: (prevPortfolio[currency.symbol] || 0) + parseFloat(amount)
      }));
  
      // Log trade history
      addTradeToHistory({ type: 'buy', currency, amount });
  
      alert('購入が成功しました。');
  
    } else {
      alert('残高が不足しています。');
    }
};

const sellCurrency = (currency, amount) => {
    if ((portfolio[currency.symbol] || 0) >= parseFloat(amount)) {
  
      // Calculate revenue and fees
      const revenue = currency.price * parseFloat(amount);
      const feeAmount = revenue * fee;
  
      // Update balance and portfolio
      setBalance(prevBalance => prevBalance + revenue - feeAmount);
  
      // Remove from portfolio
      setPortfolio(prevPortfolio => ({
        ...prevPortfolio,
        [currency.symbol]: prevPortfolio[currency.symbol] - parseFloat(amount)
      }));
  
      // Log trade history
      addTradeToHistory({ type: 'sell', currency, amount });
  
      alert('販売が成功しました。');
  
    } else {
      alert('保有量が不足しています。');
    }
};

const handleLogout = () => {
localStorage.removeItem('currentUser');
setCurrentUser(null);
setPortfolio({});
setBalance(500000);
navigate('/login');
};

const exportData = () => {
// Export user data as JSON
const dataStr =
JSON.stringify({ portfolio });
const blob =
new Blob([dataStr], { type:
'application/json' });
const url =
URL.createObjectURL(blob);

const link =
document.createElement('a');
link.href =
url;
link.download =
'portfolio.json';
link.click();
};
return (
  <div className="market-container">
    <header className="market-header">
      <h1>{t('virtualCryptoTrader')}</h1>
      <div className="user-info">
        {currentUser ? (
          <>
            <span>{t('welcome')}, {currentUser}!</span>
            <span>{t('balance')}: ¥{balance ? balance.toFixed(2) : 'N/A'}</span>
            <span>{t('portfolioValue')}: ¥{calculatePortfolioValue() ? calculatePortfolioValue().toFixed(2) : 'N/A'}</span>
            <button onClick={handleLogout}>{t('logout')}</button>
          </>
        ) : (
          <Link to="/login">{t('login')}</Link>
        )}
      </div>
    </header>

    <div className="market-content">
      <aside className="left-sidebar">
        <input
          type="text"
          placeholder={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="currency-list">
          {currencies
            .filter(currency => currency.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(currency => (
              <div key={currency.id} className="currency-item" onClick={() => setSelectedCurrency(currency)}>
                <h3>{currency.name} ({currency.symbol})</h3>
                <p>¥{currency.price ? currency.price.toFixed(2) : 'N/A'}</p>
                <p className={`change ${currency.change >= 0 ? 'positive' : 'negative'}`}>
                  {currency.change >= 0 ? '▲' : '▼'} {currency.change ? Math.abs(currency.change).toFixed(2) : 'N/A'}%
                </p>  
                <p>{t('holding')}: {portfolio[currency.symbol] || 0}</p>
              </div>
            ))}
        </div>
      </aside>

      <main className="main-content">
        {selectedCurrency && (
          <>
            <h2>{selectedCurrency.name} ({selectedCurrency.symbol})</h2>
            <p>{t('currentPrice')}: ¥{selectedCurrency.price ? selectedCurrency.price.toFixed(2) : 'N/A'}</p>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={priceHistory}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="trading-panel">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('enterAmount')}
              />
              <button onClick={() => buyCurrency(selectedCurrency, amount)}>{t('buy')}</button>
              <button onClick={() => sellCurrency(selectedCurrency, amount)}>{t('sell')}</button>
            </div>
          </>
        )}
      </main>

      <aside className="right-sidebar">
        <div className="news-feed">
          <h3>{t('latestNews')}</h3>
          {news.map(item => (
            <div key={item.id} className="news-item">
              <p>{item.headline}</p>
              <small>{item.timestamp}</small>
            </div>
          ))}
        </div>
        <div className="trade-history">
          <h3>{t('tradeHistory')}</h3>
          {tradeHistory.map((trade, index) => (
            <div key={index} className="trade-item">
              <p>
                {trade.type === 'buy' ? t('bought') : t('sold')} {trade.amount} {trade.currency.symbol} @ ¥{trade.price ? trade.price.toFixed(2) : 'N/A'}
              </p>
              <p>{t('fee')}: ¥{trade.fee ? trade.fee.toFixed(2) : 'N/A'}</p>
            </div>
          ))}
        </div>
        <div className="leaderboard">
          <h3>{t('leaderboard')}</h3>
          {leaderboard.map((user, index) => (
            <div key={index} className="leaderboard-item">
              <p>{user.name}: {user.balance ? user.balance.toFixed(2) : 'N/A'}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>

    <footer className="market-footer">
        <div className="wallet-overview">
          <h3 style={{color: 'white'}}>Your Wallet Overview</h3>
          <ul>
            {currencies.map(currency => (
              <li key={currency.symbol} style={{color: 'white'}}>
                {currency.name}: {portfolio[currency.symbol] || 0} 
                (¥{((portfolio[currency.symbol] || 0) * currency.price).toFixed(2)})
              </li>
            ))}
          </ul>
          <p style={{color: 'white'}}>Total Portfolio Value: ¥{calculatePortfolioValue().toFixed(2)}</p>
        </div>
        <button onClick={exportData}>{t('exportData')}</button>
      </footer>

      {showTutorial && (
        <div className="tutorial">
          <h3>Tutorial</h3>
          <p>This is a tutorial section to guide users through the platform.</p>
          <button onClick={() => setShowTutorial(false)}>Close Tutorial</button>
        </div>
      )}
    </div>
  );
}

export default Market;