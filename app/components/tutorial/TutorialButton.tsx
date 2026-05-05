"use client";

import React from "react";
import { Button, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./TutorialButton.module.css";

interface TutorialButtonProps {
  onClick: () => void;
  isCompleted: boolean;
}

export default function TutorialButton({
  onClick,
  isCompleted,
}: TutorialButtonProps) {
  const tooltipText = isCompleted
    ? "Replay Tutorial"
    : "Start Tutorial";

  return (
    <Tooltip title={tooltipText}>
      <Button
        type="text"
        shape="circle"
        icon={<QuestionCircleOutlined style={{ fontSize: "20px" }} />}
        onClick={onClick}
        className={styles.tutorialButton}
        aria-label="Tutorial"
      />
    </Tooltip>
  );
}
