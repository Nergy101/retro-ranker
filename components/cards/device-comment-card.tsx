import { CommentContract } from "../../data/frontend/contracts/comment.contract.ts";
import { ProfileImage } from "../auth/profile-image.tsx";

interface DeviceCommentCardProps {
  comment: CommentContract;
}

// Basic HTML sanitization function
function sanitizeHTML(html: string): string {
  // Remove potentially dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/on\w+='[^']*'/g, "")
    .replace(/javascript:/gi, "");
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
        }}
      >
        <ProfileImage
          name={comment.expand?.user?.nickname || "Anonymous"}
          size={40}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.25rem",
            }}
          >
            <strong style={{ color: "var(--pico-primary)" }}>
              {comment.expand?.user?.nickname || "Anonymous"}
            </strong>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--pico-muted-color)",
              }}
            >
              {formatDate(comment.created)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          lineHeight: "1.6",
          color: "var(--pico-color)",
        }}
        dangerouslySetInnerHTML={{
          __html: sanitizeHTML(comment.content),
        }}
      />
    </article>
  );
}
