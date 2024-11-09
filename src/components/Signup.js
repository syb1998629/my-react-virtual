import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { addUser } from './userDatabase';
import './Login.css';  // 可以复用 Login 的样式

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('パスワードが一致しません。');
      return;
    }
    addUser(username, password);
    navigate('/login');
  };

  return (
    <div className="login-container">
      <h2>新規登録</h2>
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
        <div className="form-group">
          <label htmlFor="confirmPassword">パスワード（確認）</label>
          <input 
            type="password" 
            id="confirmPassword" 
            name="confirmPassword" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="login-button">登録</button>
      </form>
      <p className="signup-link">
        すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
}

export default Signup;