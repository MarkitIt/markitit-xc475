import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import ConversationList from './ConversationList';
import MessageArea from './MessageArea';
import { Conversation } from '@/lib/firebaseChat';

interface ChatInterfaceProps {
  userId: string;
  activeTab: 'personal' | 'community';
  setActiveTab: (tab: 'personal' | 'community') => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  userId,
  activeTab,
  setActiveTab,
}) => {
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 200px)',
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <ConversationList
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userId={userId}
      />

      <MessageArea conversation={selectedConversation} userId={userId} />
    </div>
  );
};

export default ChatInterface;
