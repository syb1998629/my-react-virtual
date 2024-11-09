import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const cryptocurrencies = ['ビットコイン', 'イーサリアム', 'リップル', 'カルダノ', 'ドージコイン'];

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const loadFromLocalStorage = (key, defaultValue) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

export function Practise() {
  const [quarterlyData, setQuarterlyData] = useState(loadFromLocalStorage('quarterlyData', []));
  const [currentQuarter, setCurrentQuarter] = useState(loadFromLocalStorage('currentQuarter', 0));
  const [currentCrypto, setCurrentCrypto] = useState(loadFromLocalStorage('currentCrypto', 0));
  const [balance, setBalance] = useState(loadFromLocalStorage('balance', 15000000000));
  const [exchangeRate, setExchangeRate] = useState(150); 
  const [holdings, setHoldings] = useState(loadFromLocalStorage('holdings', {}));
  const [showMA, setShowMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showFullData, setShowFullData] = useState(false);
  const [error] = useState(null);
  const [tradeHistory, setTradeHistory] = useState(loadFromLocalStorage('tradeHistory', []));

  useEffect(() => {
    const fetchExchangeRate = async () => {
        try {
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY'); // 示例API
            const data = await response.json();
            setExchangeRate(data.rates.USD); // 根据API返回的数据更新汇率
        } catch (error) {
            console.error('获取汇率时出错:', error);
        }
    };

    fetchExchangeRate();
}, []);

  useEffect(() => {
    if (quarterlyData.length === 0) {
      const generateQuarterlyData = () => {
        const quarters = [];
        for (let i = 0; i < 4; i++) {
          const daysInQuarter = i === 1 ? 91 : 92;
          const quarterData = {};
          cryptocurrencies.forEach(crypto => {
            const basePrice = crypto === 'ビットコイン' ? 3000000 : 
                              crypto === 'イーサリアム' ? 200000 : 
                              crypto === 'リップル' ? 50 : 
                              crypto === 'カルダノ' ? 100 : 
                              crypto === 'ドージコイン' ? 10 : 1000;
            const priceData = Array.from({length: daysInQuarter}, () => 
              Math.floor(basePrice * (1 + (Math.random() - 0.5) * 0.1))
            );
            const volumeData = Array.from({length: daysInQuarter}, () => 
              Math.floor(Math.random() * 1000000)
            );
            quarterData[crypto] = { priceData, volumeData };
          });
          quarters.push(quarterData);
        }
        setQuarterlyData(quarters);
      };
      generateQuarterlyData();
      setHoldings(Object.fromEntries(cryptocurrencies.map(crypto => [crypto, 0])));
    }
  }, [quarterlyData]);

  useEffect(() => {
    saveToLocalStorage('quarterlyData', quarterlyData);
  }, [quarterlyData]);

  useEffect(() => {
    saveToLocalStorage('currentQuarter', currentQuarter);
  }, [currentQuarter]);

  useEffect(() => {
    saveToLocalStorage('currentCrypto', currentCrypto);
  }, [currentCrypto]);

  useEffect(() => {
    saveToLocalStorage('balance', balance);
  }, [balance]);

  useEffect(() => {
    saveToLocalStorage('holdings', holdings);
  }, [holdings]);

  useEffect(() => {
    saveToLocalStorage('tradeHistory', tradeHistory);
  }, [tradeHistory]);
  
  useEffect(() => {
    saveToLocalStorage('balance', balance);
}, [balance]);
localStorage.removeItem('balance');

  const calculateMA = (data, period) => {
    return data.map((_, index, array) => {
      if (index < period - 1) return null;
      const sum = array.slice(index - period + 1, index + 1).reduce((a, b) => a + b, 0);
      return sum / period;
    });
  };

  const calculateRSI = (data, period = 14) => {
    let gains = 0;
    let losses = 0;
    return data.map((price, index, array) => {
      if (index < period) return null;
      const change = price - array[index - 1];
      gains = (gains * (period - 1) + (change > 0 ? change : 0)) / period;
      losses = (losses * (period - 1) + (change < 0 ? -change : 0)) / period;
      const rs = gains / losses;
      return 100 - (100 / (1 + rs));
    });
  };

  const generateChartData = (quarterData) => {
    const startDate = new Date(`2023-0${currentQuarter * 3 + 1}-01`);
    const labels = quarterData[cryptocurrencies[currentCrypto]].priceData.map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      return date.toISOString().split('T')[0];
    });

    const cryptoData = quarterData[cryptocurrencies[currentCrypto]];
    const visibleDataLength = Math.floor(cryptoData.priceData.length / 2);
    const visiblePriceData = showFullData ? cryptoData.priceData : 
      cryptoData.priceData.slice(0, visibleDataLength).concat(Array(cryptoData.priceData.length - visibleDataLength).fill(null));
    const visibleVolumeData = showFullData ? cryptoData.volumeData : 
      cryptoData.volumeData.slice(0, visibleDataLength).concat(Array(cryptoData.volumeData.length - visibleDataLength).fill(null));

    return {
      labels: labels,
      datasets: [
        {
          type: 'line',
          label: '価格',
          data: visiblePriceData,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          yAxisID: 'y',
        },
        ...(showMA ? [
          {
            type: 'line',
            label: '10日移動平均',
            data: calculateMA(visiblePriceData, 10),
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: '30日移動平均',
            data: calculateMA(visiblePriceData, 30),
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
            yAxisID: 'y',
          }
        ] : []),
        ...(showRSI ? [
          {
            type: 'line',
            label: 'RSI',
            data: calculateRSI(visiblePriceData),
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.1,
            yAxisID: 'rsi',
          }
        ] : []),
        ...(showVolume ? [
          {
            type: 'bar',
            label: '取引量',
            data: visibleVolumeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            yAxisID: 'volume',
          }
        ] : []),
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: '日付',
          color: '#666',
          font: {
            family: 'Arial',
            size: 12,
            weight: 'bold',
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: '価格（円）',
          color: '#666',
          font: {
            family: 'Arial',
            size: 12,
            weight: 'bold',
          },
        },
      },
      rsi: {
        type: 'linear',
        display: showRSI,
        position: 'right',
        min: 0,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: showRSI,
          text: 'RSI',
          color: '#666',
          font: {
            family: 'Arial',
            size: 12,
            weight: 'bold',
          },
        },
      },
      volume: {
        type: 'linear',
        display: showVolume,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: showVolume,
          text: '取引量',
          color: '#666',
          font: {
            family: 'Arial',
            size: 12,
            weight: 'bold',
          },
        },
      },
    },
  };

  const buy = () => {
    const currentPrice = quarterlyData[currentQuarter][cryptocurrencies[currentCrypto]].priceData.slice(-1)[0];
    if (balance >= currentPrice) {
      setBalance(balance - currentPrice);
      setHoldings({ ...holdings, [cryptocurrencies[currentCrypto]]: (holdings[cryptocurrencies[currentCrypto]] || 0) + 1 });
      setTradeHistory([...tradeHistory, {
        type: 'buy',
        crypto: cryptocurrencies[currentCrypto],
        price: currentPrice,
        date: new Date().toISOString()
      }]);
    }
  };

  const sell = () => {
    const currentPrice = quarterlyData[currentQuarter][cryptocurrencies[currentCrypto]].priceData.slice(-1)[0];
    if (holdings[cryptocurrencies[currentCrypto]] > 0) {
      setBalance(balance + currentPrice);
      setHoldings({ ...holdings, [cryptocurrencies[currentCrypto]]: holdings[cryptocurrencies[currentCrypto]] - 1 });
      setTradeHistory([...tradeHistory, {
        type: 'sell',
        crypto: cryptocurrencies[currentCrypto],
        price: currentPrice,
        date: new Date().toISOString()
      }]);
    }
  };

  const calculateTradeProfit = (trade, currentPrice) => {
    if (trade.type === 'buy') {
      return currentPrice - trade.price;
    } else {
      return trade.price - currentPrice;
    }
  };

  const TradeHistory = () => {
    const totalProfit = tradeHistory.reduce((acc, trade) => {
      const currentPrice = quarterlyData[currentQuarter][trade.crypto].priceData.slice(-1)[0];
      return acc + calculateTradeProfit(trade, currentPrice);
    }, 0);
    
    return (
      <div>
        <h3>交易历史</h3>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>类型</th>
              <th>加密货币</th>
              <th>价格</th>
              <th>当前价格</th>
              <th>盈亏</th>
            </tr>
          </thead>
          <tbody>
            {tradeHistory.map((trade, index) => {
              const currentPrice = quarterlyData[currentQuarter][trade.crypto].priceData.slice(-1)[0];
              const profit = calculateTradeProfit(trade, currentPrice);
              return (
                <tr key={index}>
                  <td>{new Date(trade.date).toLocaleString()}</td>
                  <td>{trade.type === 'buy' ? '买入' : '卖出'}</td>
                  <td>{trade.crypto}</td>
                  <td>{trade.price.toLocaleString()}円</td>
                  <td>{currentPrice.toLocaleString()}円</td>
                  <td>{profit.toLocaleString()}円</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p>总盈亏：{totalProfit.toLocaleString()}円</p>
      </div>
    );
  };

  if (error) {
    return <div>エラーが発生しました: {error.message}</div>;
  }

  return (
    <div>
      <h1>仮想通貨取引シミュレーション</h1>
      <div>
        <label>
          四半期:
          <select value={currentQuarter} onChange={(e) => setCurrentQuarter(Number(e.target.value))}>
            {[0, 1, 2, 3].map((quarter) => (
              <option key={quarter} value={quarter}>Q{quarter + 1}</option>
            ))}
          </select>
        </label>
        <label>
          仮想通貨:
          <select value={currentCrypto} onChange={(e) => setCurrentCrypto(Number(e.target.value))}>
            {cryptocurrencies.map((crypto, index) => (
              <option key={index} value={index}>{crypto}</option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={showMA} onChange={() => setShowMA(!showMA)} />
          移動平均を表示
        </label>
        <label>
          <input type="checkbox" checked={showRSI} onChange={() => setShowRSI(!showRSI)} />
          RSIを表示
        </label>
        <label>
          <input type="checkbox" checked={showVolume} onChange={() => setShowVolume(!showVolume)} />
          取引量を表示
        </label>
      </div>
      <div>
        <button onClick={() => setShowFullData(!showFullData)}>
          {showFullData ? '前半のデータのみ表示' : '全データを表示'}
        </button>
      </div>
      {quarterlyData.length > 0 && (
        <Chart type="bar" data={generateChartData(quarterlyData[currentQuarter])} options={chartOptions} />
      )}
      <div>
        <h2>取引</h2>
        <p>残高: {balance.toLocaleString()}円 (約 {(balance / exchangeRate).toLocaleString()} USD)</p>
        <p>保有量: {holdings[cryptocurrencies[currentCrypto]] || 0} {cryptocurrencies[currentCrypto]}</p>
        <button onClick={buy}>買う</button>
        <button onClick={sell}>売る</button>
      </div>
      <TradeHistory />
    </div>
  );
}