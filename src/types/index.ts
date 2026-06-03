export interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface Post {
  id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  tags: string[];
  likes: number;
  comments: Comment[];
}

export interface GuestbookEntry {
  id: string;
  author: string;
  content: string;
  date: string;
}
