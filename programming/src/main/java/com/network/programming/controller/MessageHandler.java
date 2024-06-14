package com.network.programming.controller;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class MessageHandler {

    private static final Logger logger = Logger.getLogger(MessageHandler.class.getName());

    private SocketIOServer server;

    @Autowired
    public MessageHandler(SocketIOServer server) {
        this.server = server;
        registerListeners(server);
    }

    public void registerListeners(SocketIOServer server) {
        server.addConnectListener(onConnect());
        server.addDisconnectListener(onDisconnect());
        server.addEventListener("message", ChatMessage.class, onMessage()); // 메시지를 객체로 수신
        server.addEventListener("joinRoom", String.class, onJoinRoom());
        server.addEventListener("leaveRoom", String.class, onLeaveRoom());
    }

    public ConnectListener onConnect() {
        return client -> {
            logger.info(String.format("Socket ID[%s] Connected to socket", client.getSessionId().toString()));
        };
    }

    public DisconnectListener onDisconnect() {
        return client -> {
            logger.info(String.format("Socket ID[%s] Disconnected from socket", client.getSessionId().toString()));
        };
    }

    public DataListener<ChatMessage> onMessage() {
        return (client, data, ackRequest) -> {
            if (data.getMessage().contains("사과")) { // 정답인지 확인하는 로직
                server.getRoomOperations("1").sendEvent("correctAnswer");
                client.disconnect(); // 클라이언트 연결 종료
            } else {
                server.getRoomOperations("1").sendEvent("message", data); // 메시지를 브로드캐스트
            }
        };
    }

    public DataListener<String> onJoinRoom() {
        return (client, projectId, ackRequest) -> {
            client.joinRoom(projectId);
            logger.info(String.format("Client %s joined room: %s", client.getSessionId(), projectId));
        };
    }

    public DataListener<String> onLeaveRoom() {
        return (client, projectId, ackRequest) -> {
            client.leaveRoom(projectId);
            logger.info(String.format("Client %s left room: %s", client.getSessionId(), projectId));
        };
    }

    public static class ChatMessage {
        private String sender;
        private String message;

        public ChatMessage() {}

        public ChatMessage(String sender, String message) {
            this.sender = sender;
            this.message = message;
        }

        public String getSender() {
            return sender;
        }

        public void setSender(String sender) {
            this.sender = sender;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
