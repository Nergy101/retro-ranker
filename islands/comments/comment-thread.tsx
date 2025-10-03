import { useState } from "preact/hooks";
import { DeviceCommentCard } from "../../components/cards/device-comment-card.tsx";
import { CommentReplyForm } from "../forms/comment-reply-form.tsx";
import { CommentContract } from "../../data/frontend/contracts/comment.contract.ts";
import { User } from "../../data/frontend/contracts/user.contract.ts";

interface CommentThreadProps {
  comments: CommentContract[];
  user: User | null;
  deviceId: string;
}

export function CommentThread(
  { comments, user, deviceId }: CommentThreadProps,
) {
  const [replyingTo, setReplyingTo] = useState<CommentContract | null>(null);
  const [optimisticReplies, setOptimisticReplies] = useState<
    Record<string, CommentContract[]>
  >({});
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(),
  );

  const handleReply = (parentComment: CommentContract) => {
    if (!user) return;
    setReplyingTo(parentComment);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleReplyAdded = (reply: CommentContract) => {
    const parentId = reply.parent_comment!;
    setOptimisticReplies((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] || []), reply],
    }));
  };

  const toggleThread = (commentId: string) => {
    setExpandedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Recursive component to render comments with their replies
  const renderComment = (comment: CommentContract, depth = 0) => {
    // Combine existing replies with optimistic replies
    const allReplies = [
      ...(comment.expand?.replies || []),
      ...(optimisticReplies[comment.id] || []),
    ];

    const isExpanded = expandedThreads.has(comment.id);
    const hasReplies = allReplies.length > 0;

    return (
      <div key={comment.id}>
        <DeviceCommentCard
          comment={comment}
          user={user}
          onReply={handleReply}
          maxDepth={3}
          hasReplies={hasReplies}
          isExpanded={isExpanded}
          onToggleReplies={() => toggleThread(comment.id)}
        />

        {/* Reply form appears below the comment being replied to */}
        {replyingTo && replyingTo.id === comment.id && user && (
          <CommentReplyForm
            parentComment={replyingTo}
            deviceId={deviceId}
            user={user}
            onCancel={handleCancelReply}
            onReplyAdded={handleReplyAdded}
          />
        )}

        {/* Expand/Collapse button is now inside the comment card */}

        {/* Render nested replies (only if expanded) */}
        {hasReplies && isExpanded && (
          <div style={{ marginLeft: "2rem", marginTop: "1rem" }}>
            {allReplies.map((reply) =>
              renderComment(reply, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {comments.map((comment) => renderComment(comment))}
    </div>
  );
}
