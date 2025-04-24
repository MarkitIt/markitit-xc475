import React, { useState, useEffect, useRef } from "react";
import { theme } from "@/styles/theme";
import {
  Conversation,
  Message,
  getConversationMessages,
  sendMessage,
} from "@/lib/firebaseChat";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MessageAreaProps {
  conversation: Conversation | null;
  userId: string;
}

interface UserInfo {
  [key: string]: {
    name: string;
    avatar?: string;
  };
}

const MessageArea: React.FC<MessageAreaProps> = ({ conversation, userId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchUserInfo = async (userIds: string[]) => {
    const uniqueUserIds = [...new Set(userIds)];
    const userInfoTemp: UserInfo = {};

    for (const uid of uniqueUserIds) {
      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userInfoTemp[uid] = {
            name: userData.firstName || (uid === userId ? "You" : "User"),
            avatar: userData.photoURL,
          };
        } else {
          userInfoTemp[uid] = {
            name: uid === userId ? "You" : "User",
            avatar: undefined,
          };
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        userInfoTemp[uid] = {
          name: uid === userId ? "You" : "User",
          avatar: undefined,
        };
      }
    }

    setUserInfo(userInfoTemp);
  };

  useEffect(() => {
    if (!conversation?.id) {
      setMessages([]);
      return;
    }

    setLoading(true);
    const unsubscribe = getConversationMessages(conversation.id, (msgs) => {
      setMessages(msgs);
      setLoading(false);

      const userIds = msgs.map((msg) => msg.senderId);
      fetchUserInfo(userIds);
    });

    return () => unsubscribe();
  }, [conversation?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !conversation?.id) return;

    try {
      await sendMessage(conversation.id, userId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getUserName = (senderId: string) => {
    return userInfo[senderId]?.name || (senderId === userId ? "You" : "User");
  };

  const renderConversationAvatar = () => {
    if (conversation?.imageUrl) {
      return (
        <img
          src={conversation.imageUrl}
          alt={conversation.name || "Chat"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: theme.borderRadius.full,
          }}
        />
      );
    } else {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: theme.typography.fontSize.header,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.background.white,
          }}
        >
          {conversation?.name?.charAt(0) || "U"}
        </div>
      );
    }
  };

  if (!conversation) {
    return (
      <div
        style={{
          width: "541px",
          height: "781px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: `${theme.colors.background.main}36`,
          borderRadius: theme.borderRadius.lg,
          position: "relative",
          zIndex: 0,
        }}
      >
        <p
          style={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.text.primary,
            textAlign: "center",
          }}
        >
          Select a conversation to start chatting
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: "541px",
        height: "781px",
        position: "relative",
        borderRadius: theme.borderRadius.lg,
        overflow: "hidden",
        backgroundColor: `${theme.colors.background.main}36`,
        zIndex: 0,
      }}
    >
      <div
        style={{
          height: "110px",
          backgroundColor: theme.colors.background.main,
          width: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
          display: "flex",
          alignItems: "center",
          padding: `0 ${theme.spacing.lg}`,
        }}
      >
        <div
          style={{
            width: "68px",
            height: "68px",
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.primary.beige,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: theme.typography.fontSize.header,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.background.white,
            marginRight: theme.spacing.md,
          }}
        >
          {renderConversationAvatar()}
        </div>

        <div>
          <div
            style={{
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.xs,
            }}
          >
            {conversation.name || "Chat"}
          </div>

          {conversation.type === "community" && (
            <div
              style={{
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.regular,
                fontSize: theme.typography.fontSize.small,
                color: theme.colors.text.primary,
              }}
            >
              {conversation.memberCount || 0} people
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "110px",
          left: 0,
          right: 0,
          bottom: "79px",
          overflowY: "auto",
          padding: theme.spacing.md,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: theme.spacing.md }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
            }}
          >
            <p
              style={{
                fontFamily: theme.typography.fontFamily.primary,
                fontWeight: theme.typography.fontWeight.regular,
                fontSize: theme.typography.fontSize.small,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.md,
              }}
            >
              This is the start of your
              <br />
              {conversation.type === "community"
                ? "community group"
                : "conversation"}
              --- start chatting!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === userId;
            const isFirstMessageOfGroup =
              index === 0 || messages[index - 1].senderId !== message.senderId;

            return (
              <div
                key={message.id}
                style={{ width: "100%", marginBottom: theme.spacing.xs }}
              >
                {isFirstMessageOfGroup && (
                  <div
                    style={{
                      textAlign: isCurrentUser ? "right" : "left",
                      fontSize: theme.typography.fontSize.small,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.secondary,
                      marginBottom: theme.spacing.xs,
                      paddingLeft: isCurrentUser ? 0 : theme.spacing.md,
                      paddingRight: isCurrentUser ? theme.spacing.md : 0,
                    }}
                  >
                    {getUserName(message.senderId)}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isCurrentUser
                        ? theme.colors.primary.coral
                        : theme.colors.background.white,
                      color: isCurrentUser
                        ? theme.colors.background.white
                        : theme.colors.text.primary,
                      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
                      borderRadius: theme.borderRadius.lg,
                      maxWidth: "70%",
                      marginBottom: theme.spacing.xs,
                      wordBreak: "break-word",
                    }}
                  >
                    {message.text}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "10px",
                    color: theme.colors.text.secondary,
                    textAlign: isCurrentUser ? "right" : "left",
                    paddingLeft: isCurrentUser ? 0 : theme.spacing.md,
                    paddingRight: isCurrentUser ? theme.spacing.md : 0,
                    marginBottom: theme.spacing.xs,
                  }}
                >
                  {message.timestamp &&
                    new Date(
                      message.timestamp.seconds * 1000,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "79px",
          padding: `0 ${theme.spacing.lg}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "59px",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: theme.borderRadius.lg,
            display: "flex",
            alignItems: "center",
            paddingLeft: theme.spacing.md,
            paddingRight: theme.spacing.md,
          }}
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontFamily: theme.typography.fontFamily.primary,
              fontWeight: theme.typography.fontWeight.medium,
              fontSize: theme.typography.fontSize.small,
              color: theme.colors.text.primary,
            }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            style={{
              backgroundColor: theme.colors.primary.coral,
              color: theme.colors.background.white,
              border: "none",
              borderRadius: theme.borderRadius.full,
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: newMessage.trim() ? "pointer" : "default",
              opacity: newMessage.trim() ? 1 : 0.5,
            }}
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageArea;
