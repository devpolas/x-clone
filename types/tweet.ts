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

  author: {
    id: string;
    name: string;
    username?: string | null;
    bio?: string | null;
    avatar?: string | null;
  };
  likes: Array<{
    id: string;
    createdAt: Date;
    userId: string;
    tweetId: string;
  }>;

  children?: TweetType[];
}
