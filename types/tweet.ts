export interface TweetAuthor {
  id: string;
  name: string;
  username?: string | null;
  bio?: string | null;
  avatar?: string | null;
  createdAt: Date;
}

export interface TweetType {
  id: string;
  content: string;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  author: TweetAuthor;
  likes: Array<{ id: string; userId: string }>;

  children?: TweetType[];
}
