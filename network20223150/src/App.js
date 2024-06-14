// src/App.js
import React, { useState } from 'react';

import ChatRoom from './components/ChatRoom';
import Login from './components/Login';

const App = () => {
  const [nickname, setNickname] = useState(null);
  
  const handleLogin = (nickname) => {
    setNickname(nickname);
  };

  return (
    <div>
      {!nickname ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom nickname={nickname} />
      )}
    </div>
  );
};

export default App;

