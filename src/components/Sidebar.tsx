"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBlog } from "@/context/BlogContext";
import styles from "./Sidebar.module.css";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { todayVisitors, totalVisitors, posts } = useBlog();

  // Get categories from posts
  const categories = Array.from(new Set(posts.map(post => post.category)));

  // Count posts per category
  const getCategoryCount = (category: string) => {
    return posts.filter(post => post.category === category).length;
  };

  const handleAlert = (msg: string) => {
    alert(msg);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Profile Card */}
      <div className={styles.card}>
        <div className={styles.profileImageContainer}>
          <Image
            src="/profile_avatar.png"
            alt="Profile Avatar"
            width={120}
            height={120}
            className={styles.profileImage}
            priority
          />
        </div>
        <div className={styles.profileInfo}>
          <div className={styles.nameSection}>
            <span className={styles.nickname}>sorakim579</span>
            <span className={styles.realname}>(김소라)</span>
          </div>
          <p className={styles.bio}>
            사용자 경험을 고민하고 지속적인 성장을 기록하는 프론트엔드 개발자입니다.
          </p>
        </div>
        <div className={styles.profileButtons}>
          <button 
            className={styles.primaryBtn}
            onClick={() => handleAlert("김소라 님에게 이웃 신청을 보냈습니다. (시뮬레이션)")}
          >
            이웃추가
          </button>
          <button 
            className={styles.secondaryBtn}
            onClick={() => handleAlert("메일 주소: sorakim579@gmail.com")}
          >
            안부글
          </button>
        </div>
      </div>

      {/* Counter Card */}
      <div className={`${styles.card} ${styles.counterCard}`}>
        <div className={styles.visitorCounter}>
          <div className={styles.visitorItem}>
            <span className={styles.visitorLabel}>TODAY</span>
            <span className={styles.visitorValue}>{todayVisitors}</span>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.visitorItem}>
            <span className={styles.visitorLabel}>TOTAL</span>
            <span className={styles.visitorValue}>{totalVisitors}</span>
          </div>
        </div>
      </div>

      {/* Category Menu */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>카테고리</h3>
        <nav className={styles.navMenu}>
          <ul>
            <li className={pathname === "/" ? styles.activeLi : ""}>
              <Link href="/">
                <span>전체보기</span>
                <span className={styles.count}>({posts.length})</span>
              </Link>
            </li>
            {categories.map(category => (
              <li 
                key={category}
                className={pathname === `/?category=${encodeURIComponent(category)}` ? styles.activeLi : ""}
              >
                <Link href={`/?category=${encodeURIComponent(category)}`}>
                  <span className={styles.subCategory}>└ {category}</span>
                  <span className={styles.count}>({getCategoryCount(category)})</span>
                </Link>
              </li>
            ))}
            <li className={pathname === "/guestbook" ? styles.activeLi : ""}>
              <Link href="/guestbook">
                <span>방명록</span>
                <span className={styles.count}>({pathname === "/guestbook" ? "*" : "guest"})</span>
              </Link>
            </li>
            <li className={pathname === "/write" ? styles.activeLi : ""}>
              <Link href="/write" className={styles.writeLink}>
                <span>📝 포스트 글쓰기</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Neighbors Section */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>이웃 링크</h3>
        <div className={styles.linksList}>
          <a href="https://github.com/sorakim579" target="_blank" rel="noopener noreferrer" className={styles.linkItem}>
            <span className={styles.linkIcon}>🐙</span> GitHub 저장소
          </a>
          <a href="mailto:sorakim579@gmail.com" className={styles.linkItem}>
            <span className={styles.linkIcon}>✉️</span> 이메일 보내기
          </a>
          <button onClick={() => handleAlert("연락처: 010-XXXX-XXXX (이력서 제출 시 공개)")} className={styles.linkItem}>
            <span className={styles.linkIcon}>📱</span> 연락처 확인
          </button>
        </div>
      </div>
    </aside>
  );
};
