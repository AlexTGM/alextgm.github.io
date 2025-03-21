"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect } from "react";

export default function Home() {
  const onSignIn = (response: { credential: string }) => {
    console.log("Encoded JWT ID token:", response);
  };

  useEffect(() => {
    // Attach the onSignIn function to the global window object (required for Google Sign-In)
    (window as unknown as Record<string, unknown>).onSignIn = onSignIn;
  }, []);

  return (
    <>
      <script src="https://accounts.google.com/gsi/client" async defer></script>

      <div className={styles.page}>
        <main className={styles.main}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>
              Get started by editing <code>src/app/page.tsx</code>.
            </li>
            <li>Save and see your changes instantly.</li>

            <div
              id="g_id_onload"
              data-client_id="918254786145-n465du05i4ds04e3q0oluakjmsp27usr.apps.googleusercontent.com"
              data-context="signin"
              data-ux_mode="popup"
              data-callback="onSignIn"
              // data-login_uri="http://localhost:3001"
              data-itp_support="true"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="pill"
              data-theme="filled_blue"
              data-text="continue_with"
              data-size="large"
              data-logo_alignment="left"
            ></div>
          </ol>

          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
