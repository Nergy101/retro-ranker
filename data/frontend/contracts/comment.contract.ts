import { User } from "./user.contract.ts";

export interface CommentContract {
  id: string;
  content: string;
  userId: string;
  deviceId: string;
  created: string;
  updated: string;
  expand: {
    user: User;
  };
}
