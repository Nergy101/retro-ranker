import { CommentContract } from "../../data/frontend/contracts/comment.contract.ts";
import { ProfileImage } from "../auth/profile-image.tsx";

interface DeviceCommentCardProps {
  comment: CommentContract;
}

// Basic HTML sanitization function
function sanitizeHTML(html: string): string {
  // Remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '');
}

export function DeviceCommentCard({ comment }: DeviceCommentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAvatarUrl = (nickname: string) => {
    const seed = encodeURIComponent(nickname);
    const backgroundType = "solid,gradientLinear";
    return `https://api.dicebear.com/9.x/fun-emoji/svg?seed=${seed}&backgroundType=${backgroundType}`;
  };

  return (
    <article
      class="small-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.25rem",
        backgroundColor: "var(--pico-card-background-color)",
        border: "1px solid var(--pico-primary-border)",
        borderRadius: "0.75rem",
        transition: "all 0.2s ease-in-out",
        margin: "2em",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginRight: "auto",
        }}
      >
        <ProfileImage name={comment.expand.user.nickname} size={32} />
        <span
          style={{
            fontWeight: "600",
            color: "var(--pico-primary)",
            fontSize: "0.875rem",
          }}
        >
          {comment.expand.user.nickname}
        </span>
      </div>
      <div
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          lineHeight: "1.6",
          color: "var(--pico-contrast)",
          fontSize: "0.9375rem",
          padding: "0.5rem 0",
          width: "100%",
          textAlign: "left",
        }}
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(comment.content) }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "var(--pico-muted-color)",
          marginLeft: "auto",
        }}
      >
        {comment.updated !== comment.created && (
          <span style={{ fontStyle: "italic", marginRight: "1rem" }}>
            Last updated: {formatDate(comment.updated)}
          </span>
        )}
        <span>{formatDate(comment.created)}</span>
      </div>
    </article>
  );
}
