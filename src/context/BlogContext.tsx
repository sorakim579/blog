"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Post, GuestbookEntry, Comment } from "@/types";
import defaultPosts from "@/data/posts.json";
import defaultGuestbook from "@/data/guestbook.json";

interface BlogContextType {
  posts: Post[];
  guestbook: GuestbookEntry[];
  todayVisitors: number;
  totalVisitors: number;
  addPost: (post: Omit<Post, "id" | "date" | "likes" | "comments">) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, author: string, content: string) => void;
  addGuestbook: (author: string, content: string) => void;
  deleteGuestbook: (id: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>([]);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load from localStorage or defaults
    const storedPosts = localStorage.getItem("naver_blog_posts");
    const storedGuestbook = localStorage.getItem("naver_blog_guestbook");
    
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } else {
      setPosts(defaultPosts as Post[]);
      localStorage.setItem("naver_blog_posts", JSON.stringify(defaultPosts));
    }

    if (storedGuestbook) {
      setGuestbook(JSON.parse(storedGuestbook));
    } else {
      setGuestbook(defaultGuestbook as GuestbookEntry[]);
      localStorage.setItem("naver_blog_guestbook", JSON.stringify(defaultGuestbook));
    }

    // Set visitor counter (Today / Total)
    const lastVisit = localStorage.getItem("naver_blog_last_visit");
    const todayStr = new Date().toISOString().slice(0, 10);
    
    let storedToday = Number(localStorage.getItem("naver_blog_today") || "0");
    let storedTotal = Number(localStorage.getItem("naver_blog_total") || "1342"); // Start with a realistic total count

    if (lastVisit !== todayStr) {
      // New day visit
      storedToday = Math.floor(Math.random() * 20) + 5; // Initial today count
      storedTotal += 1;
      localStorage.setItem("naver_blog_last_visit", todayStr);
    } else {
      // Same day visit, but let's increment today on first mount
      storedToday += 1;
      storedTotal += 1;
    }
    
    localStorage.setItem("naver_blog_today", String(storedToday));
    localStorage.setItem("naver_blog_total", String(storedTotal));
    
    setTodayVisitors(storedToday);
    setTotalVisitors(storedTotal);
    setInitialized(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem("naver_blog_posts", JSON.stringify(posts));
    }
  }, [posts, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("naver_blog_guestbook", JSON.stringify(guestbook));
    }
  }, [guestbook, initialized]);

  const addPost = (newPostData: Omit<Post, "id" | "date" | "likes" | "comments">) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    // Create url-friendly ID
    const urlId = newPostData.title
      .toLowerCase()
      .replace(/[^a-z0-9ㄱ-ㅎㅏ-ㅣ가-힣\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 30);
    
    const id = urlId || `post-${Date.now()}`;

    const newPost: Post = {
      ...newPostData,
      id,
      date: dateStr,
      likes: 0,
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const likePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addComment = (postId: string, author: string, content: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: author || "익명",
      content,
      date: dateStr
    };

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  const addGuestbook = (author: string, content: string) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    
    const newEntry: GuestbookEntry = {
      id: `g-${Date.now()}`,
      author: author || "익명",
      content,
      date: dateStr
    };

    setGuestbook(prev => [newEntry, ...prev]);
  };

  const deleteGuestbook = (id: string) => {
    setGuestbook(prev => prev.filter(entry => entry.id !== id));
  };

  return (
    <BlogContext.Provider
      value={{
        posts,
        guestbook,
        todayVisitors,
        totalVisitors,
        addPost,
        likePost,
        addComment,
        addGuestbook,
        deleteGuestbook
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};
