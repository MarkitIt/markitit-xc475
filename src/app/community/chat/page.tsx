'use client';

import { useState } from 'react';
import { theme } from '@/styles/theme';
import { useUserContext } from '@/context/UserContext';
import 'react-chat-elements/dist/main.css';

export default function ChatPage() {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState<'personal' | 'community'>('community');

  if (!user) {
    return (
      <div style={{
        backgroundColor: theme.colors.background.main,
        minHeight: 'calc(100vh - 80px)',
        padding: theme.spacing.xl,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.body,
          color: theme.colors.text.primary,
        }}>
          Please sign in to access your chats
        </p>
      </div>
    );
  }

  return (
    <main style={{
      backgroundColor: theme.colors.background.main,
      minHeight: 'calc(100vh - 80px)',
      padding: theme.spacing.xl,
    }}>
      <h1 style={{
        fontSize: theme.typography.fontSize.title,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xl,
      }}>
        {activeTab === 'personal' ? 'Personal Chats' : 'Community Chats'}
      </h1>
      
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 200px)',
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.1)',
      }}>
        <div style={{
          padding: theme.spacing.xl,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
          }}>
            <button
              onClick={() => setActiveTab('personal')}
              style={{
                backgroundColor: activeTab === 'personal' ? theme.colors.primary.coral : theme.colors.background.main,
                color: activeTab === 'personal' ? theme.colors.background.white : theme.colors.text.primary,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.body,
              }}
            >
              Personal Chats
            </button>
            <button
              onClick={() => setActiveTab('community')}
              style={{
                backgroundColor: activeTab === 'community' ? theme.colors.primary.coral : theme.colors.background.main,
                color: activeTab === 'community' ? theme.colors.background.white : theme.colors.text.primary,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
                fontSize: theme.typography.fontSize.body,
              }}
            >
              Community Chats
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}