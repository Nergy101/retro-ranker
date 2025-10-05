import { PiPaperPlaneRight } from "@preact-icons/pi";
import { useState } from "preact/hooks";
import { ProfileImage } from "../../components/auth/profile-image.tsx";
import { CommentContract } from "../../data/frontend/contracts/comment.contract.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";

interface CommentReplyFormProps {
  parentComment: CommentContract;
  deviceId: string;
  user: User;
  onCancel?: () => void;
  onReplyAdded?: (reply: CommentContract) => void;
}

export function CommentReplyForm({
  parentComment,
  deviceId,
  user,
  onCancel,
  onReplyAdded,
}: CommentReplyFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Create optimistic reply object
    const optimisticReply: CommentContract = {
      id: `temp-${Date.now()}`, // Temporary ID
      content: content.trim(),
      device: deviceId,
      user: user.id,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      parent_comment: parentComment.id,
      depth: (parentComment.depth || 0) + 1,
      thread_id: parentComment.thread_id || parentComment.id,
      expand: {
        user: {
          id: user.id,
          nickname: user.nickname,
        },
      },
    };

    // Immediately add the reply to the UI (optimistic update)
    if (onReplyAdded) {
      onReplyAdded(optimisticReply);
    }

    // Clear form and close
    setContent("");
    if (onCancel) onCancel();

    try {
      const response = await fetch("/api/comments/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: deviceId,
          parent_comment_id: parentComment.id,
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        console.error("Failed to submit reply");
        // Note: In a real app, you might want to show an error message
        // and remove the optimistic update, but since the API redirects,
        // the page will reload anyway
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      // Note: Same as above - page will reload on success
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: "1em",
        padding: "1rem",
        backgroundColor: "var(--pico-card-background-color)",
        border: "1px solid var(--pico-primary-border)",
        borderRadius: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <ProfileImage
          name={user.nickname}
          user={user}
          size={24}
        />
        <span style={{ fontSize: "0.9rem", color: "var(--pico-muted-color)" }}>
          Replying to {parentComment.expand?.user?.nickname || "user"}
        </span>
      </div>

      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
        onSubmit={handleSubmit}
      >
        <textarea
          value={content}
          onInput={(e) => setContent((e.target as HTMLTextAreaElement).value)}
          placeholder="Write your reply..."
          required
          rows={3}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid var(--pico-primary-border)",
            borderRadius: "0.25rem",
            backgroundColor: "var(--pico-background-color)",
            color: "var(--pico-color)",
            fontSize: "0.9rem",
            lineHeight: "1.4",
            resize: "vertical",
            minHeight: "4rem",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.5rem 1rem",
                backgroundColor: "var(--pico-primary)",
                color: "var(--pico-primary-inverse)",
                border: "none",
                borderRadius: "0.25rem",
                cursor: content.trim() && !isSubmitting
                  ? "pointer"
                  : "not-allowed",
                opacity: content.trim() && !isSubmitting ? 1 : 0.5,
                fontSize: "0.9rem",
              }}
            >
              <PiPaperPlaneRight size={16} />
              {isSubmitting ? "Posting..." : "Reply"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  color: "var(--pico-muted-color)",
                  border: "1px solid var(--pico-muted-border)",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Cancel
              </button>
            )}
          </div>

          <span
            style={{ fontSize: "0.8rem", color: "var(--pico-muted-color)" }}
          >
            {content.length}/500
          </span>
        </div>
      </form>
    </div>
  );
}
