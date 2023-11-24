// src/components/Message.tsx
import React from 'react';
import { MessageDto } from '../models/Message';

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <div style={{ backgroundColor: message.isUser ? "#DCF8C6" : "#FFFFFF", padding: "8px", borderRadius: "8px" }}>
        {message.content}
      </div>
    </div>
  );
};

export default Message;