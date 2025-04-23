import React, { useState, useEffect } from "react";
import { theme } from "@/styles/theme";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { joinCommunityChat, Conversation } from "@/lib/firebaseChat";

interface JoinCommunityModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  userId,
  onClose,
  onSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [communities, setCommunities] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const communitiesRef = collection(db, "conversations");
      const q = query(communitiesRef, where("type", "==", "community"));

      const querySnapshot = await getDocs(q);
      const results: Conversation[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Conversation;
        if (
          data.name &&
          data.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          results.push({ id: doc.id, ...data });
        }
      });

      setCommunities(results);
    } catch (err) {
      console.error("Error searching communities:", err);
      setError("Failed to search communities");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (communityId: string) => {
    setJoining(true);
    setError("");

    try {
      await joinCommunityChat(communityId, userId);
      onSuccess();
    } catch (err) {
      console.error("Error joining community:", err);
      setError("Failed to join community");
      setJoining(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          width: "500px",
          maxWidth: "90%",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        <h2
          style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
          }}
        >
          Join a Community
        </h2>

        <div
          style={{
            display: "flex",
            marginBottom: theme.spacing.lg,
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for communities"
            style={{
              flex: 1,
              padding: theme.spacing.md,
              margin: 0,
              borderRadius: `${theme.borderRadius.md} 0 0 ${theme.borderRadius.md}`,
              border: "1px solid rgba(0,0,0,0.1)",
              borderRight: "none",
              backgroundColor: "#f5f5f5",
              color: "black",
              fontSize: theme.typography.fontSize.body,
              fontFamily: theme.typography.fontFamily.primary,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !searchQuery.trim()}
            style={{
              padding: theme.spacing.md,
              margin: 0,
              borderRadius: `0 ${theme.borderRadius.md} ${theme.borderRadius.md} 0`,
              border: "1px solid rgba(0,0,0,0.1)",
              borderLeft: "none",
              backgroundColor: "#F16261",
              color: theme.colors.background.white,
              cursor: loading || !searchQuery.trim() ? "default" : "pointer",
              opacity: loading || !searchQuery.trim() ? 0.7 : 1,
              fontFamily: theme.typography.fontFamily.primary,
              display: "flex",
              alignItems: "center",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: theme.spacing.md,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            marginBottom: theme.spacing.lg,
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {communities.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: theme.spacing.md,
                color: theme.colors.text.secondary,
              }}
            >
              {searchQuery.trim()
                ? "No communities found"
                : "Search for communities to join"}
            </div>
          ) : (
            communities.map((community) => (
              <div
                key={community.id}
                style={{
                  padding: theme.spacing.md,
                  borderBottom: "1px solid rgba(0,0,0,0.05)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {community.name}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: theme.colors.text.secondary,
                    }}
                  >
                    {community.memberCount || 0} members
                  </div>
                </div>
                <button
                  onClick={() => handleJoin(community.id!)}
                  disabled={joining || community.participants?.includes(userId)}
                  style={{
                    padding: theme.spacing.xs,
                    borderRadius: theme.borderRadius.md,
                    border: "none",
                    backgroundColor: "#F16261",
                    color: theme.colors.background.white,
                    cursor:
                      joining || community.participants?.includes(userId)
                        ? "default"
                        : "pointer",
                    opacity:
                      joining || community.participants?.includes(userId)
                        ? 0.7
                        : 1,
                    fontFamily: theme.typography.fontFamily.primary,
                    minWidth: "80px",
                    textAlign: "center",
                  }}
                >
                  {community.participants?.includes(userId) ? "Joined" : "Join"}
                </button>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              borderRadius: theme.borderRadius.md,
              border: "1px solid rgba(0,0,0,0.1)",
              backgroundColor: theme.colors.background.white,
              color: theme.colors.text.primary,
              cursor: "pointer",
              fontFamily: theme.typography.fontFamily.primary,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCommunityModal;
