"use client";

import React, { useState, useRef } from "react";
import { useBlog } from "@/context/BlogContext";
import styles from "./Write.module.css";

export default function WritePage() {
  const { posts, addPost } = useBlog();
  const [category, setCategory] = useState("포트폴리오");
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [published, setPublished] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get current list of categories for dropdown
  const categories = Array.from(new Set(posts.map(post => post.category)));

  const handleInsertHtml = (startTag: string, endTag: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = startTag + selected + endTag;

    setContent(
      text.substring(0, start) + replacement + text.substring(end)
    );

    // Reset cursor focus and position after insert
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + startTag.length,
        start + startTag.length + selected.length
      );
    }, 50);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const selectedCategory = isAddingCategory && newCategory.trim() 
      ? newCategory.trim() 
      : category;

    const tags = tagsStr
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    addPost({
      title: title.trim(),
      category: selectedCategory,
      content: content.trim(),
      tags
    });

    setTitle("");
    setContent("");
    setTagsStr("");
    setPublished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to trigger browser download of updated posts.json
  const downloadPostsJson = () => {
    // Generate a data URL for downloading posts.json
    const postsData = localStorage.getItem("naver_blog_posts");
    if (!postsData) return;

    // Pretty print JSON
    const prettyJson = JSON.stringify(JSON.parse(postsData), null, 2);
    
    const blob = new Blob([prettyJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "posts.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📝 스마트에디터 2.0 (글쓰기)</h1>

      {published && (
        <div className={styles.successBanner}>
          <div className={styles.successTitle}>🎉 포스트 등록 완료! (로컬 브라우저 반영됨)</div>
          <p className={styles.successDesc}>
            포스트가 브라우저에 임시 등록되었습니다! 이 변경사항을 영구히 저장하고 Vercel 배포에 반영하려면, 아래 버튼을 눌러 <strong>posts.json</strong> 파일을 다운로드한 뒤, <code>src/data/posts.json</code> 위치에 덮어쓰고 Git에 Push하세요.
          </p>
          <button onClick={downloadPostsJson} className={styles.downloadBtn}>
            📥 posts.json 다운로드
          </button>
        </div>
      )}

      <form onSubmit={handlePublish} className={styles.form}>
        {/* Category selection */}
        <div className={styles.row}>
          <label className={styles.label}>카테고리 선택</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {!isAddingCategory ? (
              <>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className={styles.select}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button 
                  type="button" 
                  onClick={() => setIsAddingCategory(true)}
                  className={styles.toolBtn}
                  style={{ whiteSpace: "nowrap" }}
                >
                  + 새 카테고리
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="새 카테고리명 입력"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className={styles.input}
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setIsAddingCategory(false)}
                  className={styles.toolBtn}
                  style={{ whiteSpace: "nowrap" }}
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <div className={styles.row}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            placeholder="포스트 제목을 입력하세요"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        {/* Content with helper toolbar */}
        <div className={styles.row}>
          <label className={styles.label}>본문 내용 (HTML 입력 가능)</label>
          
          <div className={styles.toolbar}>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<strong>", "</strong>")} 
              className={styles.toolBtn}
            >
              굵게
            </button>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<h3>", "</h3>")} 
              className={styles.toolBtn}
            >
              대제목
            </button>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<h4>", "</h4>")} 
              className={styles.toolBtn}
            >
              소제목
            </button>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<blockquote>", "</blockquote>")} 
              className={styles.toolBtn}
            >
              인용구
            </button>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<hr/>")} 
              className={styles.toolBtn}
            >
              구분선
            </button>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<a href=\"URL\" target=\"_blank\">", "</a>")} 
              className={styles.toolBtn}
            >
              링크
            </button>
            <button 
              type="button" 
              onClick={() => handleInsertHtml("<p>", "</p>")} 
              className={styles.toolBtn}
            >
              단락
            </button>
          </div>

          <textarea
            ref={textareaRef}
            placeholder="포스트 본문을 HTML 형식이나 텍스트로 작성해보세요. 툴바 버튼을 이용하면 구조화된 포스트를 쉽게 작성할 수 있습니다."
            value={content}
            onChange={e => setContent(e.target.value)}
            className={`${styles.input} ${styles.editorTextarea}`}
            rows={12}
            required
          />
        </div>

        {/* Tags */}
        <div className={styles.row}>
          <label className={styles.label}>태그 (쉼표로 구분)</label>
          <input
            type="text"
            placeholder="예: 프론트엔드, Nextjs, 포트폴리오"
            value={tagsStr}
            onChange={e => setTagsStr(e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Submit */}
        <button type="submit" className={styles.submitBtn}>
          발행하기
        </button>
      </form>
    </div>
  );
}
