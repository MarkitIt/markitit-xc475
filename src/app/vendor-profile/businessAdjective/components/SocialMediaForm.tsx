import styles from '../styles.module.css';

interface SocialMediaFormProps {
  website: string;
  description: string;
  facebookLink: string;
  twitterHandle: string;
  instagramHandle: string;
  onWebsiteChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFacebookLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTwitterHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInstagramHandleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SocialMediaForm = ({
  website,
  description,
  facebookLink,
  twitterHandle,
  instagramHandle,
  onWebsiteChange,
  onDescriptionChange,
  onFacebookLinkChange,
  onTwitterHandleChange,
  onInstagramHandleChange,
}: SocialMediaFormProps) => {
  return (
    <>
      <div>Website</div>
      <input
        className={styles.input}
        value={website}
        onChange={onWebsiteChange}
        required
      />

      <div>Description</div>
      <textarea
        className={styles.textarea}
        value={description}
        onChange={onDescriptionChange}
        required
      />

      <div>Facebook link</div>
      <input
        className={styles.input}
        value={facebookLink}
        onChange={onFacebookLinkChange}
        required
      />

      <div>Twitter "X" handle</div>
      <input
        className={styles.input}
        value={twitterHandle}
        onChange={onTwitterHandleChange}
        required
      />

      <div>Instagram handle</div>
      <input
        className={styles.input}
        value={instagramHandle}
        onChange={onInstagramHandleChange}
        required
      />
    </>
  );
}; 