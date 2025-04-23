import React, { useState, useRef } from "react";
import { theme } from "@/styles/theme";
import { createCommunityChat } from "@/lib/firebaseChat";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
  const [communityName, setCommunityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim()) {
      setError("Please enter a community name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let imageUrl = null;

      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `community-images/${Date.now()}-${imageFile.name}`,
        );

        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await createCommunityChat(communityName, userId, [], imageUrl);
      onSuccess();
    } catch (err) {
      console.error("Error creating community:", err);
      setError("Failed to create community");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
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
          width: "400px",
          maxWidth: "90%",
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
                display: "block",
                marginBottom: theme.spacing.sm,
                color: theme.colors.text.primary,
              }}
            >
              Community Name
            </label>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter community name"
              style={{
                width: "100%",
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                border: "1px solid rgba(0,0,0,0.1)",
                backgroundColor: "#f5f5f5",
                color: "black",
                fontSize: theme.typography.fontSize.body,
                fontFamily: theme.typography.fontFamily.primary,
              }}
            />
          </div>

          <div style={{ marginBottom: theme.spacing.lg }}>
            <label
              style={{
                display: "block",
                marginBottom: theme.spacing.sm,
                color: theme.colors.text.primary,
              }}
            >
              Community Image
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "150px",
                borderRadius: theme.borderRadius.md,
                border: "1px dashed rgba(0,0,0,0.1)",
                backgroundColor: theme.colors.background.main,
                marginBottom: theme.spacing.md,
                cursor: "pointer",
                overflow: "hidden",
              }}
              onClick={handleClickUpload}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Community preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      marginBottom: theme.spacing.sm,
                      fontSize: "24px",
                      color: theme.colors.text.secondary,
                    }}
                  >
                    +
                  </div>
                  <div style={{ color: theme.colors.text.secondary }}>
                    Click to upload image
                  </div>
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>

            <div
              style={{
                fontSize: theme.typography.fontSize.small,
                color: theme.colors.text.secondary,
              }}
            >
              Recommended: Square image, max 10MB
            </div>
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
              display: "flex",
              justifyContent: "flex-end",
              gap: theme.spacing.md,
            }}
          >
            <button
              type="button"
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
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: theme.borderRadius.md,
                border: "none",
                backgroundColor: "#F16261",
                color: theme.colors.background.white,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: theme.typography.fontFamily.primary,
              }}
            >
              {loading ? "Creating..." : "Create Community"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
