import React, { useState, useEffect } from 'react';
import { theme } from '@/styles/theme';
import { getUserChats, Conversation } from '@/lib/firebaseChat';
import CreateCommunityModal from './CreateCommunityModal';
import JoinCommunityModal from './JoinCommunityModal';

interface ConversationListProps {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation) => void;
  activeTab: 'personal' | 'community';
  setActiveTab: (tab: 'personal' | 'community') => void;
  userId: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversation,
  setSelectedConversation,
  activeTab,
  setActiveTab,
  userId,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const unsubscribe = getUserChats(userId, (chats) => {
      const filteredChats = chats.filter((chat) => chat.type === activeTab);
      setConversations(filteredChats);
      setLoading(false);

      if (filteredChats.length > 0 && !selectedConversation) {
        setSelectedConversation(filteredChats[0]);
      } else if (selectedConversation) {
        const stillExists = filteredChats.some(
          (chat) => chat.id === selectedConversation.id
        );
        if (!stillExists && filteredChats.length > 0) {
          setSelectedConversation(filteredChats[0]);
        } else if (!stillExists) {
          setSelectedConversation(null);
        }
      }
    });

    return () => unsubscribe();
  }, [userId, activeTab, selectedConversation, setSelectedConversation]);

  const handleCommunitySuccess = () => {
    setShowCreateModal(false);
    setShowJoinModal(false);
  };

  return (
    <div
      style={{
        width: '300px',
        borderRight: '1px solid rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
          }}
        >
          <div
            style={{
              backgroundColor: theme.colors.background.main,
              borderRadius: theme.borderRadius.full,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: theme.spacing.sm }}>🔍</span>
            <span style={{ color: theme.colors.text.secondary }}>
              Search...
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginBottom: theme.spacing.sm,
          }}
        >
          <button
            onClick={() => setActiveTab('community')}
            style={{
              backgroundColor:
                activeTab === 'community'
                  ? theme.colors.primary.coral
                  : 'transparent',
              color:
                activeTab === 'community'
                  ? theme.colors.background.white
                  : theme.colors.text.secondary,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              marginRight: theme.spacing.sm,
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
              position: 'relative',
            }}
          >
            Communities
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            style={{
              backgroundColor:
                activeTab === 'personal'
                  ? theme.colors.background.main
                  : 'transparent',
              color: theme.colors.text.secondary,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            Personal
          </button>
        </div>

        {activeTab === 'community' && (
          <div
            style={{
              display: 'flex',
              gap: theme.spacing.md,
              marginTop: theme.spacing.sm,
            }}
          >
            <button
              onClick={() => setShowJoinModal(true)}
              style={{
                backgroundColor: theme.colors.background.white,
                color: theme.colors.text.primary,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
              }}
            >
              Join
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                backgroundColor: theme.colors.background.white,
                color: theme.colors.text.primary,
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: theme.borderRadius.md,
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
              }}
            >
              Create
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {loading ? (
          <div style={{ padding: theme.spacing.md, textAlign: 'center' }}>
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: theme.spacing.md, textAlign: 'center' }}>
            No {activeTab} chats found
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              style={{
                padding: theme.spacing.md,
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                backgroundColor:
                  selectedConversation?.id === conversation.id
                    ? 'rgba(0,0,0,0.05)'
                    : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary.beige,
                  marginRight: theme.spacing.md,
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.background.white,
                }}
              >
                {conversation.name?.charAt(0) || 'U'}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.primary,
                    marginBottom: '2px',
                  }}
                >
                  {conversation.name || 'Chat'}
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    color: theme.colors.text.secondary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {activeTab === 'community' ? (
                    <span>{conversation.memberCount || 0} people</span>
                  ) : (
                    <span>{conversation.lastMessage || 'Start chatting!'}</span>
                  )}
                </div>
              </div>

              {conversation.lastMessageTimestamp && (
                <div
                  style={{
                    fontSize: '12px',
                    color: theme.colors.text.secondary,
                    alignSelf: 'flex-start',
                    marginLeft: theme.spacing.sm,
                  }}
                >
                  {new Date(
                    conversation.lastMessageTimestamp.seconds * 1000
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showCreateModal && (
        <CreateCommunityModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCommunitySuccess}
        />
      )}

      {showJoinModal && (
        <JoinCommunityModal
          userId={userId}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleCommunitySuccess}
        />
      )}
    </div>
  );
};

export default ConversationList;
