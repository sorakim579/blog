import type { Metadata } from "next";
import "./globals.css";
import { BlogProvider } from "@/context/BlogContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "sorakim579의 개발 블로그 : 네이버 블로그 스타일 포트폴리오",
  description: "프론트엔드 개발자 김소라(sorakim579)의 개인 포트폴리오 블로그입니다. 네이버 블로그 레이아웃을 통해 친숙하고 재미있는 경험을 제공합니다.",
  keywords: ["김소라", "sorakim579", "프론트엔드 포트폴리오", "Next.js 포트폴리오", "개발자 블로그", "React"],
  openGraph: {
    title: "sorakim579의 개발 블로그",
    description: "프론트엔드 개발자 김소라의 개인 포트폴리오 블로그",
    images: [{ url: "/profile_avatar.png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <BlogProvider>
          <Header />
          <div className={styles.container}>
            <Sidebar />
            <main className={styles.mainContent}>
              {children}
            </main>
          </div>
          <footer className={styles.footer}>
            <div className={styles.footerContent}>
              <div>
                <span>Copyright © sorakim579. All Rights Reserved.</span>
              </div>
              <div className={styles.footerLinks}>
                <a href="https://github.com/sorakim579" target="_blank" rel="noopener noreferrer">GitHub</a>
                <span>|</span>
                <a href="mailto:sorakim579@gmail.com">Email</a>
              </div>
            </div>
          </footer>
        </BlogProvider>
      </body>
    </html>
  );
}
