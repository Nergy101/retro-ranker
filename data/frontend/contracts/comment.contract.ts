export interface CommentContract {
  id: string;
  content: string;
  device: string;
  user: string;
  created: string;
  updated: string;
  parent_comment?: string;
  depth?: number;
  thread_id?: string;
  expand?: {
    user?: {
      id: string;
      nickname: string;
    };
    parent_comment?: CommentContract;
    replies?: CommentContract[];
    reactions?: CommentReactionContract[];
  };
}

export interface CommentReactionContract {
  id: string;
  comment: string;
  user: string;
  reaction_type: "thumbs_up" | "thumbs_down" | "heart" | "laugh";
  created: string;
  updated: string;
  expand?: {
    user?: {
      id: string;
      nickname: string;
    };
  };
}
