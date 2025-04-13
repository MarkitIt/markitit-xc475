import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import Image from 'next/image';

interface ConversationListProps {
  selectedConversation: any | null;
  setSelectedConversation: (conversation: any) => void;
  activeTab: 'personal' | 'community';
  setActiveTab: (tab: 'personal' | 'community') => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  selectedConversation,
  setSelectedConversation,
  activeTab,
  setActiveTab,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  
  // mock, TODO
  const mockCommunityConversations = [
    {
      id: 'comm1',
      name: 'Brooklyn Candle Makers',
      memberCount: 30,
      lastMessageTimestamp: new Date(),
      image: '/placeholder.png',
    },
    {
      id: 'comm2',
      name: 'Pop-Up Print Club',
      memberCount: 80,
      lastMessageTimestamp: new Date(Date.now() - 3600000),
      image: '/placeholder.png',
    },
    {
      id: 'comm3',
      name: 'Jewelry Making Vendors',
      memberCount: 5,
      lastMessageTimestamp: new Date(Date.now() - 7200000),
      image: '/placeholder.png',
    },
    {
      id: 'comm4',
      name: 'Boston Clothing Sellers',
      memberCount: 100,
      lastMessageTimestamp: new Date(Date.now() - 10800000), 
      image: '/placeholder.png',
    },
    {
      id: 'comm5',
      name: 'Sticker-Making Group',
      memberCount: 45,
      lastMessageTimestamp: new Date(Date.now() - 14400000), // 4 hours ago
      image: '/placeholder.png',
    },
  ];
  
  const mockPersonalConversations = [
    {
      id: 'pers1',
      name: 'Sarah Johnson',
      role: 'Host of Brooklyn Pop-Up',
      lastMessage: 'Looking forward to seeing your work!',
      lastMessageTimestamp: new Date(),
      image: '/placeholder.png',
    },
    {
      id: 'pers2',
      name: 'Al Smith',
      lastMessage: 'When is the next event?',
      lastMessageTimestamp: new Date(Date.now() - 3600000), 
      image: '/placeholder.png',
    },
    {
      id: 'pers3',
      name: 'Claire Boola',
      lastMessage: 'Great talking to you!',
      lastMessageTimestamp: new Date(Date.now() - 7200000),
      image: '/placeholder.png',
    },
  ];
  
  const conversations = activeTab === 'personal' ? mockPersonalConversations : mockCommunityConversations;

  return (
    <div style={{
      width: '300px',
      borderRight: '1px solid rgba(0,0,0,0.1)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: theme.spacing.md,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: theme.spacing.md,
        }}>
          <div style={{
            backgroundColor: theme.colors.background.main,
            borderRadius: theme.borderRadius.full,
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}>
            <span style={{ marginRight: theme.spacing.sm }}>🔍</span>
            <span style={{ color: theme.colors.text.secondary }}>Search...</span>
          </div>
        </div>

        <div style={{
          display: 'flex',
          marginBottom: theme.spacing.sm,
        }}>
          <button
            onClick={() => setActiveTab('community')}
            style={{
              backgroundColor: activeTab === 'community' ? theme.colors.primary.coral : 'transparent',
              color: activeTab === 'community' ? theme.colors.background.white : theme.colors.text.secondary,
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
            {activeTab === 'community' && showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                backgroundColor: theme.colors.background.white,
                borderRadius: theme.borderRadius.md,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: theme.spacing.sm,
                zIndex: 10,
                width: '100px',
              }}>
                <div 
                  style={{
                    padding: theme.spacing.xs,
                    cursor: 'pointer',
                    color: theme.colors.text.primary,
                  }}
                >
                  Join
                </div>
                <div 
                  style={{
                    padding: theme.spacing.xs,
                    cursor: 'pointer',
                    color: theme.colors.text.primary,
                  }}
                >
                  Create
                </div>
              </div>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('personal')}
            style={{
              backgroundColor: activeTab === 'personal' ? theme.colors.background.main : 'transparent',
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
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            marginTop: theme.spacing.sm,
          }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
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

      <div style={{
        flex: 1,
        overflowY: 'auto',
      }}>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedConversation(conversation)}
            style={{
              padding: theme.spacing.md,
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              backgroundColor: selectedConversation?.id === conversation.id
                ? 'rgba(0,0,0,0.05)'
                : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{
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
            }}>
              {conversation.name?.charAt(0)}
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.primary,
                marginBottom: '2px',
              }}>
                {conversation.name}
              </div>
              
              <div style={{
                fontSize: '14px',
                color: theme.colors.text.secondary,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {activeTab === 'community' ? (
                  <span>{conversation.memberCount} people</span>
                ) : (
                  <span>{conversation.role || conversation.lastMessage}</span>
                )}
              </div>
            </div>
            
            <div style={{
              fontSize: '12px',
              color: theme.colors.text.secondary,
              alignSelf: 'flex-start',
              marginLeft: theme.spacing.sm,
            }}>
              {conversation.lastMessageTimestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;