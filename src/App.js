import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from './i18n';
import PerplexityComponent from './PerplexityComponent';
import Home from './components/Home';
import Market from './components/Market';
import Login from './components/Login';
import Signup from './components/Signup';
import { Practise } from './components/Practise';
import './App.css';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
      .then(() => console.log('Language changed successfully'))
      .catch(err => console.error('Error changing language:', err));
  };

  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('zh')}>中文</button>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
    </div>
  );
}

function App() {
  const { t } = useTranslation();
  
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <div className="App">
          <nav>
            <ul>
              <li><Link to="/">{t('home')}</Link></li>
              <li><Link to="/practise">{t('practiseGame')}</Link></li>
              <li><Link to="/quiz">{t('quiz')}</Link></li>
              <li><Link to="/market">{t('marketSim')}</Link></li>
              <li><Link to="/login">{t('login')}</Link></li>
              <LanguageSwitcher />
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/practise" element={<Practise />} />
            <Route path="/quiz" element={<PerplexityComponent />} />
            <Route path="/market" element={<Market />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </I18nextProvider>
  );
}

export default App;