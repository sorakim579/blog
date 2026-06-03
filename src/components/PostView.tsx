"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Post } from "@/types";
import { useBlog } from "@/context/BlogContext";
import styles from "./PostView.module.css";

interface PostViewProps {
  post: Post;
}

export const PostView: React.FC<PostViewProps> = ({ post }) => {
  const { likePost, addComment } = useBlog();
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = () => {
    setIsLiking(true);
    likePost(post.id);
    setTimeout(() => setIsLiking(false), 600); // match animation length
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    addComment(post.id, commentAuthor.trim(), commentContent.trim());
    setCommentAuthor("");
    setCommentContent("");
  };

  const copyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className={styles.postCard}>
      {/* Post Header */}
      <div className={styles.header}>
        <div className={styles.metaTop}>
          <span className={styles.category}>{post.category}</span>
          <button onClick={copyUrl} className={styles.copyLink}>
            {copied ? "URL 복사 완료!" : "URL 복사"}
          </button>
        </div>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.metaBottom}>
          <div className={styles.authorInfo}>
            <span className={styles.author}>sorakim579</span>
            <span className={styles.date}>{post.date}</span>
          </div>
          <div className={styles.urlDisplay}>
            <span>https://blog.naver.com/sorakim579/{post.id}</span>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className={styles.contentContainer}>
        <div 
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Post Tags */}
      <div className={styles.tagsContainer}>
        {post.tags.map(tag => (
          <span key={tag} className={styles.tag}>#{tag}</span>
        ))}
      </div>

      {/* Post Reactions (Likes / Comments summary) */}
      <div className={styles.reactionSection}>
        <button 
          onClick={handleLike} 
          className={`${styles.likeBtn} ${isLiking ? styles.liking : ""}`}
        >
          <span className={styles.heartIcon}>❤️</span> 
          <span>공감</span> 
          <span className={styles.likeCount}>{post.likes}</span>
        </button>
        <div className={styles.commentCount}>
          <span>댓글 {post.comments.length}</span>
        </div>
      </div>

      {/* Post Navigation */}
      <div className={styles.navigation}>
        <Link href="/" className={styles.backBtn}>
          목록보기
        </Link>
      </div>

      {/* Comments Section */}
      <div className={styles.commentSection}>
        <h3 className={styles.commentTitle}>댓글 <span className={styles.greenText}>{post.comments.length}</span></h3>
        
        {post.comments.length === 0 ? (
          <p className={styles.emptyComments}>첫 댓글을 남겨보세요!</p>
        ) : (
          <div className={styles.commentsList}>
            {post.comments.map(comment => (
              <div key={comment.id} className={styles.commentItem}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.commentDate}>{comment.date}</span>
                </div>
                <p className={styles.commentText}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <div className={styles.commentFormRow}>
            <input
              type="text"
              placeholder="이름 (익명)"
              value={commentAuthor}
              onChange={e => setCommentAuthor(e.target.value)}
              className={styles.authorInput}
            />
          </div>
          <div className={styles.commentFormBody}>
            <textarea
              placeholder="개인정보를 보호하고, 친절한 댓글을 작성해주세요."
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              rows={3}
              required
              className={styles.contentInput}
            />
            <button type="submit" className={styles.submitBtn}>
              등록
            </button>
          </div>
        </form>
      </div>
    </article>
  );
};
