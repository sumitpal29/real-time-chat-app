"use client";
import { useState, useCallback, useContext } from "react";
import cx from "classnames";
import styles from "./page.module.css";
import { Button } from "@repo/ui/button";
import { useSocket } from "../contexts/SocketProvider";

export default function Page(): JSX.Element {
  const [msg, setMsg] = useState("");
  const onClickHandler = useCallback(() => {
    console.log(msg);
    sendMessage(msg);
    setMsg("");
  }, [msg]);
  const { sendMessage, allMsgs } = useSocket();
  console.log("content", allMsgs);
  return (
    <main className={styles.main}>
      <h1 className={styles.description}>Chat</h1>
      <div className={styles.msgBox}>
        <div className={styles.receivedChat}>This is my post</div>
        {allMsgs.map(({ content, isReceived }) => (
          <div
            className={cx(styles.content, {
              [styles.receivedContent]: isReceived,
            })}
          >
            {content}
          </div>
        ))}
      </div>
      <div className={styles.inputSection}>
        <input value={msg} onChange={(e) => setMsg(e.target.value)} />
        <Button onclick={onClickHandler}>Send</Button>
      </div>
    </main>
  );
}
