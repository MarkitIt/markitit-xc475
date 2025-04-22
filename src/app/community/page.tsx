'use client';

import { useState } from 'react';
import { theme } from '@/styles/theme';
import { useUserContext } from '@/context/UserContext';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>(
    'community'
  );

  if (!user) {
    return (
      <div
        style={{
          backgroundColor: theme.colors.background.main,
          minHeight: 'calc(100vh - 80px)',
          padding: theme.spacing.xl,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p
          style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.primary,
          }}
        >
          Please sign in to access your chats
        </p>
      </div>
    );
  }

  return (
    <main
      style={{
        backgroundColor: theme.colors.background.white,
        height: 'calc(100vh - 80px)',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <ChatInterface
        userId={user.uid}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </main>
  );
}
