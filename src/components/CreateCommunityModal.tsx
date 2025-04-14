import React, { useState } from 'react';
import { theme } from '@/styles/theme';
import { createCommunityChat } from '@/lib/firebaseChat';

interface CreateCommunityModalProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  userId,
  onClose,
  onSuccess,
}) => {
  const [communityName, setCommunityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim()) {
      setError('Please enter a community name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createCommunityChat(communityName, userId);
      onSuccess();
    } catch (err) {
      console.error('Error creating community:', err);
      setError('Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: theme.colors.background.white,
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.xl,
          width: '400px',
          maxWidth: '90%',
        }}
      >
        <h2
          style={{
            fontSize: theme.typography.fontSize.header,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.lg,
          }}
        >
          Create a Community
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: theme.spacing.lg }}>
            <label
              style={{
                display: 'block',
                marginBottom: theme.spacing.sm,
                color: theme.colors.text.primary,
              }}
            >
              Community Name
            </label>
            <input
              type='text'
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder='Enter community name'
              style={{
                width: '100%',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: '#f5f5f5',
                color: 'black',
                fontSize: theme.typography.fontSize.body,
                fontFamily: theme.typography.fontFamily.primary,
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: 'red',
                marginBottom: theme.spacing.md,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: theme.spacing.md,
            }}
          >
            <button
              type='button'
              onClick={onClose}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: theme.borderRadius.md,
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: theme.colors.background.white,
                color: theme.colors.text.primary,
                cursor: 'pointer',
                fontFamily: theme.typography.fontFamily.primary,
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: theme.borderRadius.md,
                border: 'none',
                backgroundColor: '#F16261',
                color: theme.colors.background.white,
                cursor: loading ? 'default' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: theme.typography.fontFamily.primary,
              }}
            >
              {loading ? 'Creating...' : 'Create Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
