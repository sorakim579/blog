"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useBlog } from "@/context/BlogContext";
import styles from "./PostList.module.css";

export const PostList: React.FC = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const { posts } = useBlog();

  // Filter posts by category if parameter exists
  const filteredPosts = categoryParam
    ? posts.filter(post => post.category === categoryParam)
    : posts;

  // Helper to strip HTML tags for summary snippet
  const stripHtml = (html: string) => {
    if (typeof window === "undefined") return html.replace(/<[^>]*>/g, ""); // basic fallback for SSR
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className={styles.postListContainer}>
      {/* Category Title Header */}
      <div className={styles.listHeader}>
        <h2 className={styles.categoryTitle}>
          {categoryParam ? `${categoryParam}` : "전체글"}
          <span className={styles.count}> ({filteredPosts.length}개의 글)</span>
        </h2>
        <div className={styles.viewMode}>
          <span className={styles.activeMode}>블로그식 보기</span>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className={styles.emptyList}>
          등록된 포스트가 없습니다.
        </div>
      ) : (
        <div className={styles.posts}>
          {filteredPosts.map(post => (
            <article key={post.id} className={styles.postItem}>
              {/* Category Badging */}
              <div className={styles.postMeta}>
                <span className={styles.category}>{post.category}</span>
                <span className={styles.date}>{post.date}</span>
              </div>
              
              {/* Post Title */}
              <h3 className={styles.postTitle}>
                <Link href={`/posts/${post.id}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Post Snippet */}
              <p className={styles.postSummary}>
                {stripHtml(post.content).slice(0, 160)}...
              </p>

              {/* Interactive Footer */}
              <div className={styles.postFooter}>
                <div className={styles.tags}>
                  {post.tags.map(tag => (
                    <span key={tag} className={styles.tag}>#{tag}</span>
                  ))}
                </div>
                <div className={styles.stats}>
                  <span className={styles.likes}>
                    ❤️ 공감 <span className={styles.num}>{post.likes}</span>
                  </span>
                  <span className={styles.comments}>
                    💬 댓글 <span className={styles.num}>{post.comments.length}</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
