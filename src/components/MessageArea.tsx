import React, { useState, useRef, useEffect } from 'react';
import { theme } from '@/styles/theme';

interface MessageAreaProps {
  conversation: any | null;
  userId: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({ conversation, userId }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversation) {
        // mock TODO
      const mockMessages = [
        {
          id: 'm1',
          senderId: userId === 'test-user-123' ? 'other-user' : userId,
          text: 'Hello there!',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: 'm2',
          senderId: userId,
          text: 'Hi! How are you?',
          timestamp: new Date(Date.now() - 3500000),
        },
        {
          id: 'm3',
          senderId: userId === 'test-user-123' ? 'other-user' : userId,
          text: 'I\'m good, thanks for asking!',
          timestamp: new Date(Date.now() - 3400000),
        },
      ];
      setMessages(mockMessages);
    } else {
      setMessages([]);
    }
  }, [conversation, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation) return;

    const newMsg = {
      id: `new-${Date.now()}`,
      senderId: userId,
      text: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  if (!conversation) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
      }}>
        <p style={{
          fontSize: theme.typography.fontSize.body,
          color: theme.colors.text.secondary,
        }}>
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <div style={{
        padding: theme.spacing.md,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: theme.colors.primary.beige,
          marginRight: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: theme.typography.fontWeight.bold,
          color: theme.colors.background.white,
        }}>
          {conversation.name?.charAt(0)}
        </div>
        
        <div>
          <div style={{
            fontSize: theme.typography.fontSize.header,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
          }}>
            {conversation.name}
          </div>
          
          {'memberCount' in conversation ? (
            <div style={{
              fontSize: '14px',
              color: theme.colors.text.secondary,
            }}>
              {conversation.memberCount} people
            </div>
          ) : 'role' in conversation ? (
            <div style={{
              fontSize: '14px',
              color: theme.colors.text.secondary,
            }}>
              {conversation.role}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{
        flex: 1,
        padding: theme.spacing.md,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.background.main,
        opacity: 0.6,
      }}>
        {messages.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.md,
            }}>
              This is the start of your<br />
              {'memberCount' in conversation ? 'community group' : 'conversation'}--- start chatting!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              style={{
                alignSelf: message.senderId === userId ? 'flex-end' : 'flex-start',
                backgroundColor: message.senderId === userId 
                  ? theme.colors.primary.coral
                  : theme.colors.background.white,
                color: message.senderId === userId 
                  ? theme.colors.background.white
                  : theme.colors.text.primary,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.md,
                maxWidth: '70%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {message.text}
              <div style={{
                fontSize: '12px',
                marginTop: '4px',
                opacity: 0.8,
                textAlign: 'right',
              }}>
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSendMessage}
        style={{
          padding: theme.spacing.md,
          borderTop: '1px solid rgba(0,0,0,0.1)',
          backgroundColor: theme.colors.background.white,
        }}
      >
        <div style={{
          display: 'flex',
          backgroundColor: theme.colors.background.main,
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.sm,
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              padding: theme.spacing.sm,
              fontSize: theme.typography.fontSize.body,
              fontFamily: theme.typography.fontFamily.primary,
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            style={{
              backgroundColor: theme.colors.primary.coral,
              color: theme.colors.background.white,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              cursor: newMessage.trim() ? 'pointer' : 'default',
              opacity: newMessage.trim() ? 1 : 0.5,
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageArea;