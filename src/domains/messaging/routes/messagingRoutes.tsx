import React from 'react';
import { Route } from 'react-router-dom';
import { ChatPage } from '../../../pages/ChatPage';

export const messagingRoutes = [
  <Route key="chat-base" path="/chat" element={<ChatPage />} />,
  <Route key="chat-conv" path="/chat/:conversationId" element={<ChatPage />} />,
  <Route key="chat-messages" path="/messages/:conversationId" element={<ChatPage />} />,
];
