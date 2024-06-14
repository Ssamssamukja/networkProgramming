// src/components/Login.js

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [nickname, setNickname] = useState('');

  const handleLogin = () => {
    if (nickname.trim() !== '') {
      onLogin(nickname);
    } else {
      alert('Please enter a nickname');
    }
  };

  return (
    <div>
      <h2>Enter your nickname</h2>
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Nickname"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
