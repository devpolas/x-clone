export interface TweetAuthor {
  id: string;
  name: string;
  username?: string | null;
  avatar?: string | null;
}

export interface TweetType {
  id: string;
  content: string;
  imageUrl?: string | null;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;

  author: TweetAuthor;

  children?: TweetType[];
}
