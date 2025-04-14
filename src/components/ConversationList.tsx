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
        backgroundColor: 'rgba(229, 229, 229, 0.21)',
        borderRadius: '10px',
      }}
    >
      <div
        style={{
          height: '110px',
          backgroundColor: 'rgba(229, 229, 229, 0.33)',
          borderRadius: '10px 10px 0 0',
          position: 'relative',
          padding: '15px',
        }}
      >
        {/* Search icon */}
        <div
          style={{
            width: '24px',
            height: '24px',
            position: 'absolute',
            top: '23px',
            left: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          🔍
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: '15px',
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
                  activeTab === 'community' ? '#F16261' : 'transparent',
                color:
                  activeTab === 'community'
                    ? theme.colors.primary.beige
                    : 'rgba(0, 0, 0, 0.79)',
                border: 'none',
                borderRadius: '10px',
                padding: '5px 15px',
                marginRight: '12px',
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.medium,
                fontSize: '13px',
                width: '123px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              Communities
              {activeTab === 'community' && (
                <span
                  style={{
                    position: 'absolute',
                    right: '11px',
                    top: '13px',
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
                  borderRadius: '10px',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  zIndex: 999,
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
                    padding: '11px 0 0 26px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                    fontSize: '13px',
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
                    padding: '11px 0 0 26px',
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: theme.typography.fontWeight.medium,
                    fontSize: '13px',
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
                  ? 'rgba(229, 229, 229, 0.72)'
                  : 'transparent',
              color: 'rgba(0, 0, 0, 0.79)',
              border: 'none',
              borderRadius: '10px',
              padding: '5px 15px',
              cursor: 'pointer',
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.medium,
              fontSize: '13px',
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
        }}
      >
        {loading ? (
          <div style={{ padding: '15px', textAlign: 'center' }}>
            Loading conversations...
          </div>
        ) : conversations.length === 0 ? (
          <div style={{ padding: '15px', textAlign: 'center' }}>
            No {activeTab} chats found
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              style={{
                height: '121px',
                backgroundColor:
                  selectedConversation?.id === conversation.id
                    ? 'rgba(250, 250, 250, 1)'
                    : 'rgba(250, 250, 250, 1)',
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
                  borderRadius: '50%',
                  backgroundColor: theme.colors.primary.beige,
                  position: 'absolute',
                  left: '12px',
                  top: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: 'white',
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
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.79)',
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
                  fontSize: '13px',
                  color: 'rgba(0, 0, 0, 0.79)',
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
                    right: '14px',
                    top: '42px',
                    fontFamily: theme.typography.fontFamily.primary,
                    fontWeight: theme.typography.fontWeight.regular,
                    fontSize: '13px',
                    color: 'rgba(0, 0, 0, 0.79)',
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
