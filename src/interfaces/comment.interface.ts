export interface Comment {
  _id: string;
  content: string;
  image?: string;
  commentCreator: {
    _id: string;
    name: string;
    username?: string;
    photo?: string;
  };
  post?: string;
  parentComment?: string | null;
  likes?: string[];
  likesCount?: number;
  repliesCount?: number;
  createdAt: string;
}