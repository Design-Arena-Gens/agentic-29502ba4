"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

const JUMP_DURATION_MS = 720;

export default function Home() {
  const [isJumping, setIsJumping] = useState(false);
  const [autoJump, setAutoJump] = useState(false);
  const [jumpCount, setJumpCount] = useState(0);

  const triggerJump = useCallback(() => {
    setIsJumping((current) => {
      if (current) {
        return current;
      }

      setJumpCount((count) => count + 1);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!isJumping) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsJumping(false);
    }, JUMP_DURATION_MS);

    return () => window.clearTimeout(timeout);
  }, [isJumping]);

  useEffect(() => {
    if (!autoJump) {
      return;
    }

    const interval = window.setInterval(() => {
      triggerJump();
    }, JUMP_DURATION_MS + 480);

    return () => window.clearInterval(interval);
  }, [autoJump, triggerJump]);

  const statusLabel = useMemo(
    () => (autoJump ? "Auto jump: on" : "Auto jump: off"),
    [autoJump],
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Make the person jump</h1>
          <p className={styles.subtitle}>
            Tap jump or enable auto mode to launch our 2D runner into the air.
          </p>
        </div>

        <section className={styles.stage} aria-live="polite">
          <div
            className={[
              styles.person,
              isJumping ? styles.personJump : undefined,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.head} />
            <div className={styles.torso}>
              <div className={styles.armLeft} />
              <div className={styles.armRight} />
            </div>
            <div className={styles.legs}>
              <div className={styles.legLeft} />
              <div className={styles.legRight} />
            </div>
          </div>
          <div className={styles.ground}>
            <div className={styles.shadow} />
          </div>
        </section>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.jumpButton}
            onClick={triggerJump}
          >
            Jump!
          </button>
          <button
            type="button"
            className={styles.autoButton}
            onClick={() => setAutoJump((value) => !value)}
          >
            {autoJump ? "Stop auto" : "Auto jump"}
          </button>
        </div>

        <dl className={styles.stats}>
          <div>
            <dt>Total jumps</dt>
            <dd>{jumpCount}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{statusLabel}</dd>
          </div>
        </dl>
      </main>
    </div>
  );
}
