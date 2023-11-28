// src/components/Message.tsx
import React from 'react';
import { MessageDto } from '../models/Message';

interface MessageProps {
  message: MessageDto;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div style={{ textAlign: message.isUser ? "right" : "left", margin: "8px" }}>
      <div
        style={{
          color: message.isUser ? "#ffffff" : "#000000",
          backgroundColor: message.isUser ? "#1186fe" : "#eaeaea",
          padding: "15px",
          borderRadius: "8px",
        }}
      >
        {message.content.split("\n").map((text, index) => (
          <>
            {text}
            <br />
          </>
        ))}
      </div>
    </div>
  );
};

export default Message;