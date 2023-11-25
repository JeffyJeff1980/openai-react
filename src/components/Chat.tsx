// src/components/Chat.tsx
import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Grid, CircularProgress } from "@mui/material";
import Message from "./Message";
import OpenAI from "openai";
import { MessageDto } from "../models/Message";

const Chat: React.FC = () => {
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<MessageDto>>(new Array<MessageDto>());
  const [input, setInput] = useState<string>("");
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);
  const [openai, setOpenai] = useState<any>(null);

  useEffect(() => {
    initChatBot();
  }, []);

  useEffect(() => {
    setMessages([
      {
        content: "Hi, I'm your personal assistant. How can I help you?",
        isUser: false,
      },
    ]);
  }, [assistant]);


  const initChatBot = async () => {
    const openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });

    // Create an assistant
    const assistant = await openai.beta.assistants.create({
      name: "Hockey Expert",
      instructions: "You are a personal assistant and hockey expert. You help people with their hockey questions.",
      tools: [{ type: "code_interpreter" }],
      model: "gpt-4-1106-preview",
    });

    // Create a thread
    const thread = await openai.beta.threads.create();

    setOpenai(openai);
    setAssistant(assistant);
    setThread(thread);
  };

  const createNewMessage = (content: string, isUser: boolean) => {
    const newMessage = new MessageDto();
    newMessage.content = content;
    newMessage.isUser = isUser;

    return newMessage;
  }

  const handleSendMessage = async () => {
    
    messages.push(createNewMessage(input, true));
    setMessages([...messages]);
    setInput("");

    // Send a message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: input,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Create a response
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    // Wait for the response to be ready
    while (response.status === "in_progress" || response.status === "queued") {
      console.log("waiting...");
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    setIsWaiting(false);

    // Get the messages for the thread
    const messageList = await openai.beta.threads.messages.list(thread.id);

    // Find the last message for the current run
    const lastMessage = messageList.data
      .filter((message) => message.run_id === run.id && message.role === "assistant")
      .pop();

    // Print the last message coming from the assistant
    if (lastMessage) {
      console.log(lastMessage.content[0]["text"].value);

      lastMessage.content[0]["text"].value.split("\n").forEach((message: string) => {
        if (message.length === 0) {
          return;
        }
        messages.push(createNewMessage(message, false));
      });

      setMessages([...messages]);
    }
  };

  return (
    <Container>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </Grid>
        {isWaiting && (
          <Grid item>
            <CircularProgress />
            {isWaiting && <div>Waiting for response...</div>}
          </Grid>
        )}
        <Grid item>
          <TextField
            label="Type your message"
            variant="outlined"
            disabled={isWaiting}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={isWaiting}>
            Send
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;
