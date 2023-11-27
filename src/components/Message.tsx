// src/components/Message.tsx
import React from 'react';
import { MessageDto } from '../models/Message';

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <div style={{ backgroundColor: message.isUser ? "#DCF8C6" : "#b8e3fc", padding: "8px", borderRadius: "8px" }}>
        {message.content.split("\n").map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default Message;