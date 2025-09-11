export interface CommentContract {
  id: string;
  content: string;
  device: string;
  user: string;
  created: string;
  updated: string;
  expand?: {
    user?: {
      id: string;
      nickname: string;
    };
  };
}
