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
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'transparent',
        position: 'relative',
        paddingTop: theme.spacing.xl,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '1440px',
          position: 'relative',
          backgroundColor: 'transparent',
          paddingBottom: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            gap: theme.spacing.xl,
            justifyContent: 'center',
            padding: `0 ${theme.spacing.xl}`,
          }}
        >
          <div
            style={{
              width: '436px',
              position: 'static',
            }}
          >
            <ConversationList
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userId={userId}
            />
          </div>

          <div
            style={{
              width: '541px',
              position: 'relative',
            }}
          >
            <MessageArea conversation={selectedConversation} userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
