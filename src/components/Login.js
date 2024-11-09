import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkUser } from './userDatabase';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkUser(username, password)) {
      localStorage.setItem('currentUser', username);
      setIsLoggedIn(true);
      setError('');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      setError('ユーザー名またはパスワードが間違っています。');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="login-success">
        <h2>ログイン成功</h2>
        <p>ようこそ、{username}さん！</p>
        <p>メインページにリダイレクトします...</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>ユーザーログイン</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">ユーザー名</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">ログイン</button>
      </form>
      <p className="signup-link">
        アカウントをお持ちでない方は <Link to="/signup">新規登録</Link>
      </p>
    </div>
  );
}

export default Login;