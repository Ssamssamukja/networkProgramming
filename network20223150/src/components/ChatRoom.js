// src/components/ChatRoom.js

import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';

let socket; // useEffect 외부에서 socket 객체를 정의

const ChatRoom = ({ nickname }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(true); // 연결 상태를 추적

  useEffect(() => {
    socket = io('ws://localhost:9092', { transports: ['websocket'] }); // WebSocket 사용

    socket.on('connect', () => {
      console.log('Connected to server');
      socket.emit('joinRoom', '1'); // 프로젝트 ID가 1인 방에 참가
    });

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('correctAnswer', () => {
      alert('You answered correctly! Disconnecting...');
      socket.disconnect(); // 정답을 맞추면 연결 종료
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // 빈 배열을 의존성 배열로 전달하여 한 번만 실행되도록 설정

  const sendMessage = (e) => {
    e.preventDefault();
    const message = { sender: nickname, message: input }; // 메시지를 객체로 생성
    socket.emit('message', message); // 객체로 보냄
    setInput('');
    console.log(message);
  };

  return (
    <div>
      <div>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}: </strong>{msg.message}
          </div>
        ))}
      </div>
      {connected ? (
        <form onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <div>You have been disconnected from the server.</div>
      )}
    </div>
  );
};

export default ChatRoom;
