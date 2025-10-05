import {
  CommentContract,
} from "../../data/frontend/contracts/comment.contract.ts";
import { ProfileImage } from "../auth/profile-image.tsx";
import { useEffect, useState } from "preact/hooks";
import {
  PiHeart,
  PiHeartFill,
  PiSmiley,
  PiSmileyFill,
  PiThumbsDown,
  PiThumbsDownFill,
  PiThumbsUp,
  PiThumbsUpFill,
} from "@preact-icons/pi";

interface DeviceCommentCardProps {
  comment: CommentContract;
  user?: {
    id: string;
    nickname: string;
  } | null;
  onReply?: (parentComment: CommentContract) => void;
  maxDepth?: number;
  hasReplies?: boolean;
  isExpanded?: boolean;
  onToggleReplies?: () => void;
}

// Basic HTML sanitization function (currently unused)
function _sanitizeHTML(html: string): string {
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

export function DeviceCommentCard({
  comment,
  user,
  onReply,
  maxDepth = 3,
  hasReplies = false,
  isExpanded = false,
  onToggleReplies,
}: DeviceCommentCardProps) {
  // Removed showRepliesState since we're handling replies in CommentThread
  const [userReactions, setUserReactions] = useState<Record<string, boolean>>(
    {},
  );
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
    {},
  );
  const [loadingReactions, setLoadingReactions] = useState<
    Record<string, boolean>
  >(
    {},
  );

  // Load existing reactions from the API
  useEffect(() => {
    const loadReactions = async () => {
      try {
        const response = await fetch(`/api/comments/${comment.id}/reactions`);
        if (response.ok) {
          const data = await response.json();
          setReactionCounts(data.counts || {});
          setUserReactions(data.userReactions || {});
        }
      } catch (error) {
        console.error("Failed to load reactions:", error);
      }
    };

    loadReactions();
  }, [comment.id]);

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

  const getReactionIcon = (type: string, filled: boolean) => {
    switch (type) {
      case "thumbs_up":
        return filled ? <PiThumbsUpFill /> : <PiThumbsUp />;
      case "heart":
        return filled ? <PiHeartFill /> : <PiHeart />;
      case "laugh":
        return filled ? <PiSmileyFill /> : <PiSmiley />;
      case "thumbs_down":
        return filled ? <PiThumbsDownFill /> : <PiThumbsDown />;
      default:
        return <PiThumbsUp />;
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (!user || loadingReactions[reactionType]) return;

    // Set loading state
    setLoadingReactions((prev) => ({
      ...prev,
      [reactionType]: true,
    }));

    // Store the current state before making changes
    const wasReacted = userReactions[reactionType];
    const currentCount = reactionCounts[reactionType] || 0;

    // Update UI immediately (optimistic update)
    setUserReactions((prev) => ({
      ...prev,
      [reactionType]: !wasReacted,
    }));
    setReactionCounts((prev) => ({
      ...prev,
      [reactionType]: currentCount + (wasReacted ? -1 : 1),
    }));

    try {
      const response = await fetch(`/api/comments/${comment.id}/reactions`, {
        method: wasReacted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reaction_type: reactionType }),
      });

      if (!response.ok) {
        // Revert the optimistic update if the API call failed
        setUserReactions((prev) => ({
          ...prev,
          [reactionType]: wasReacted,
        }));
        setReactionCounts((prev) => ({
          ...prev,
          [reactionType]: currentCount,
        }));
        console.error("Failed to update reaction on server");
      }
    } catch (error) {
      // Revert the optimistic update if there was an error
      setUserReactions((prev) => ({
        ...prev,
        [reactionType]: wasReacted,
      }));
      setReactionCounts((prev) => ({
        ...prev,
        [reactionType]: currentCount,
      }));
      console.error("Failed to update reaction:", error);
    } finally {
      // Clear loading state
      setLoadingReactions((prev) => ({
        ...prev,
        [reactionType]: false,
      }));
    }
  };

  const isReply = comment.parent_comment;
  const currentDepth = comment.depth || 0;
  const canReply = currentDepth < maxDepth && user;

  return (
    <article
      class="comment-card"
      style={{
        display: "flex",
        gap: "0.75rem",
        padding: "1rem",
        backgroundColor: "var(--pico-card-background-color)",
        border: "1px solid var(--pico-muted-border)",
        borderRadius: "0.75rem",
        margin: isReply ? "0.5rem 0 0.5rem 2rem" : "0.75rem 0",
        marginLeft: isReply ? `${2 + (currentDepth * 1.5)}rem` : "0",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease-in-out",
      }}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0 }}>
        <ProfileImage
          name={comment.expand?.user?.nickname || "Anonymous"}
          size={40}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <strong
            style={{
              color: "var(--pico-primary)",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
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
          {isReply && (
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--pico-muted-color)",
                backgroundColor: "var(--pico-muted-background)",
                padding: "0.125rem 0.5rem",
                borderRadius: "0.25rem",
                fontStyle: "italic",
              }}
            >
              replying to{" "}
              {comment.expand?.parent_comment?.expand?.user?.nickname || "user"}
            </span>
          )}
        </div>

        {/* Comment Text */}
        <div
          style={{
            lineHeight: "1.5",
            color: "var(--pico-color)",
            whiteSpace: "pre-wrap",
            fontSize: "0.9rem",
            marginBottom: "0.75rem",
          }}
        >
          {comment.content}
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {/* Reaction Buttons */}
          {user && (
            <div style={{ display: "flex", gap: "0.125rem" }}>
              {["thumbs_up", "heart", "laugh", "thumbs_down"].map((
                reactionType,
              ) => (
                <button
                  key={reactionType}
                  type="button"
                  onClick={() => handleReaction(reactionType)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.125rem",
                    padding: "0.125rem 0.25rem",
                    border: "1px solid var(--pico-primary-border)",
                    borderRadius: "0.125rem",
                    background: userReactions[reactionType]
                      ? "var(--pico-primary)"
                      : "transparent",
                    color: userReactions[reactionType]
                      ? "var(--pico-primary-inverse)"
                      : "var(--pico-primary)",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                  }}
                >
                  {getReactionIcon(reactionType, userReactions[reactionType])}
                  <span>{reactionCounts[reactionType] || 0}</span>
                </button>
              ))}
            </div>
          )}

          {/* Reply Button */}
          {canReply && onReply && (
            <button
              type="button"
              onClick={() => onReply(comment)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
                padding: "0.125rem 0.25rem",
                border: "1px solid var(--pico-primary-border)",
                borderRadius: "0.125rem",
                background: "transparent",
                color: "var(--pico-primary)",
                cursor: "pointer",
                fontSize: "0.7rem",
              }}
            >
              Reply
            </button>
          )}

          {/* Expand/Collapse button for comments with replies */}
          {hasReplies && onToggleReplies && (
            <button
              type="button"
              onClick={onToggleReplies}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
                padding: "0.125rem 0.25rem",
                border: "1px solid var(--pico-primary-border)",
                borderRadius: "0.125rem",
                background: "transparent",
                color: "var(--pico-primary)",
                cursor: "pointer",
                fontSize: "0.7rem",
              }}
            >
              {isExpanded ? "▼" : "▶"} {comment.expand?.replies?.length || 0}
              {" "}
              {comment.expand?.replies?.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
