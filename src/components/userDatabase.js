// userDatabase.js

// 从localStorage加载用户数据，如果没有则初始化为空数组
let users = JSON.parse(localStorage.getItem('users')) || [];

export const addUser = (username, password) => {
  const newUser = {
    username,
    password,
    portfolio: {},
    balance: 500000 // 初始资金50万
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
};

export const checkUser = (username, password) => {
  return users.find(user => user.username === username && user.password === password);
};

export const updateUserData = (username, portfolio, balance) => {
  const userIndex = users.findIndex(user => user.username === username);
  if (userIndex !== -1) {
    users[userIndex].portfolio = portfolio;
    users[userIndex].balance = balance;
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const getUserData = (username) => {
  return users.find(user => user.username === username);
};

export const getAllUsers = () => {
  return users;
};

export const clearAllUsers = () => {
  users = [];
  localStorage.removeItem('users');
};