"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      {/* Blog Title Banner */}
      <div 
        className={styles.banner} 
        style={{ backgroundImage: `url('/blog_banner.png')` }}
      >
        <div className={styles.bannerOverlay}>
          <div className={styles.bannerContent}>
            <Link href="/">
              <h1 className={styles.title}>sorakim579's Blog</h1>
              <p className={styles.subtitle}>코드와 설계를 고민하는 프론트엔드 개발자의 기록</p>
            </Link>
          </div>
        </div>
      </div>

      {/* Blog Navigation Menu */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navLinks}>
            <Link href="/" className={pathname === "/" ? styles.activeLink : ""}>
              프롤로그 / 블로그
            </Link>
            <Link href="/guestbook" className={pathname === "/guestbook" ? styles.activeLink : ""}>
              방명록 (Guestbook)
            </Link>
            <Link href="/write" className={pathname === "/write" ? styles.activeLink : ""}>
              글쓰기 (Write)
            </Link>
          </div>
          <div className={styles.blogUrl}>
            <span>https://github.com/sorakim579/blog</span>
          </div>
        </div>
      </nav>
    </header>
  );
};
