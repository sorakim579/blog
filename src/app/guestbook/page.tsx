"use client";

import React, { useState } from "react";
import { useBlog } from "@/context/BlogContext";
import styles from "./Guestbook.module.css";

export default function GuestbookPage() {
  const { guestbook, addGuestbook, deleteGuestbook } = useBlog();
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    addGuestbook(author.trim(), content.trim());
    setAuthor("");
    setContent("");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>방명록 (Guestbook)</h1>

      {/* Guestbook Submission Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formHeader}>
          <input
            type="text"
            placeholder="작성자 이름 (익명)"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className={styles.nameInput}
            maxLength={15}
          />
        </div>
        <textarea
          placeholder="방명록을 정성껏 작성해 주세요. 불건전한 글은 예고 없이 삭제될 수 있습니다."
          value={content}
          onChange={e => setContent(e.target.value)}
          className={styles.textarea}
          rows={4}
          required
        />
        <div className={styles.formFooter}>
          <button type="submit" className={styles.submitBtn}>
            방명록 남기기
          </button>
        </div>
      </form>

      {/* Guestbook List */}
      <div className={styles.entriesList}>
        {guestbook.length === 0 ? (
          <div className={styles.emptyState}>
            아직 방명록 글이 없습니다. 첫 글의 주인공이 되어보세요!
          </div>
        ) : (
          guestbook.map(entry => (
            <div key={entry.id} className={styles.entryCard}>
              <div className={styles.entryMeta}>
                <div>
                  <span className={styles.author}>{entry.author}</span>
                  <span style={{ margin: "0 8px", color: "#ccc" }}>|</span>
                  <span className={styles.date}>{entry.date}</span>
                </div>
                <button 
                  onClick={() => {
                    if (confirm("방명록 글을 삭제하시겠습니까?")) {
                      deleteGuestbook(entry.id);
                    }
                  }} 
                  className={styles.deleteBtn}
                  title="삭제"
                >
                  삭제
                </button>
              </div>
              <p className={styles.content}>{entry.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
