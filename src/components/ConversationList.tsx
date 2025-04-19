import React, { useState, useEffect, useRef } from 'react';
import { theme } from '@/styles/theme';
import { getUserChats, Conversation } from '@/lib/firebaseChat';
import CreateCommunityModal from './CreateCommunityModal';
import JoinCommunityModal from './JoinCommunityModal';

interface ConversationListProps {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    const unsubscribe = getUserChats(userId, (chats) => {
      const filteredChats = chats.filter((chat) => chat.type === activeTab);
      setConversations(filteredChats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, activeTab]);

  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0]);
    } else if (selectedConversation) {
      const stillExists = conversations.some(
        (chat) => chat.id === selectedConversation.id
      );
      if (!stillExists && conversations.length > 0) {
        setSelectedConversation(conversations[0]);
      } else if (!stillExists) {
        setSelectedConversation(null);
      }
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCommunitySuccess = () => {
    setShowCreateModal(false);
    setShowJoinModal(false);
  };

  return (
    <div
      style={{
        width: '436px',
        height: '781px',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: `${theme.colors.background.main}36`,
        borderRadius: theme.borderRadius.lg,
        position: 'static',
      }}
    >
      <div
        style={{
          height: '110px',
          backgroundColor: `${theme.colors.background.main}54`,
          borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
          position: 'relative',
          padding: theme.spacing.md,
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            position: 'absolute',
            top: theme.spacing.md,
            left: theme.spacing.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* 🔍 */}
        </div>

        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: theme.spacing.md,
          }}
        >
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => {
                setActiveTab('community');
                setShowDropdown(!showDropdown);
              }}
              style={{
                backgroundColor:
                  activeTab === 'community'
                    ? theme.colors.primary.coral
                    : 'transparent',
                color:
                  activeTab === 'community'
                    ? theme.colors.primary.beige
                    : theme.colors.text.primary,
                border: 'none',
                borderRadius: theme.borderRadius.lg,
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                marginRight: theme.spacing.sm,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.medium,
                fontSize: theme.typography.fontSize.small,
                width: '123px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <span style={{ marginRight: theme.spacing.md }}>Communities</span>
              {activeTab === 'community' && (
                <span
                  style={{
                    position: 'absolute',
                    right: theme.spacing.sm,
                    top: '50%',
                    transform: 'translateY(-100%)',
                    width: '12px',
                    height: '7px',
                  }}
                >
                  ▼
                </span>
              )}
            </button>

            {showDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '35px',
                  left: '4px',
                  width: '133px',
                  height: '70px',
                  backgroundColor: theme.colors.background.white,
                  borderRadius: theme.borderRadius.lg,
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  zIndex: 100,
                }}
              >
                <button
                  onClick={() => {
                    setShowJoinModal(true);
                    setShowDropdown(false);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.text.primary,
                    border: 'none',
                    padding: `${theme.spacing.sm} 0 0 ${theme.spacing.lg}`,
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                    fontSize: theme.typography.fontSize.small,
                  }}
                >
                  Join
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setShowDropdown(false);
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: theme.colors.text.primary,
                    border: 'none',
                    padding: `${theme.spacing.sm} 0 0 ${theme.spacing.lg}`,
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                    fontSize: theme.typography.fontSize.small,
                  }}
                >
                  Create
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('personal')}
            style={{
              backgroundColor:
                activeTab === 'personal'
                  ? `${theme.colors.background.main}B8`
                  : 'transparent',
              color: theme.colors.text.primary,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.medium,
              fontSize: theme.typography.fontSize.small,
              width: '89px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Personal
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1,
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
                height: '121px',
                backgroundColor: theme.colors.background.white,
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                position: 'relative',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: theme.colors.primary.beige,
                  position: 'absolute',
                  left: theme.spacing.sm,
                  top: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: theme.typography.fontSize.header,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.background.white,
                }}
              >
                {conversation.name?.charAt(0) || 'U'}
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '96px',
                  top: '39px',
                  fontFamily: theme.typography.fontFamily.primary,
                  fontWeight: theme.typography.fontWeight.semibold,
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.text.primary,
                  width: '192px',
                }}
              >
                {conversation.name || 'Chat'}
              </div>

              <div
                style={{
                  position: 'absolute',
                  left: '96px',
                  top: '62px',
                  fontFamily: theme.typography.fontFamily.primary,
                  fontWeight: theme.typography.fontWeight.regular,
                  fontSize: theme.typography.fontSize.small,
                  color: theme.colors.text.primary,
                  width: '121px',
                }}
              >
                {activeTab === 'community' ? (
                  <span>{conversation.memberCount || 0} people</span>
                ) : (
                  <span>{conversation.lastMessage || 'Start chatting!'}</span>
                )}
              </div>

              {conversation.lastMessageTimestamp && (
                <div
                  style={{
                    position: 'absolute',
                    right: theme.spacing.md,
                    top: '42px',
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: theme.typography.fontWeight.regular,
                    fontSize: theme.typography.fontSize.small,
                    color: theme.colors.text.primary,
                    textAlign: 'right',
                    width: '68px',
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
