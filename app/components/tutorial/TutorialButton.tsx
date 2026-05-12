"use client";

import React from "react";
import { Button, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import styles from "./TutorialButton.module.css";

interface TutorialButtonProps {
  onClick: () => void;
}

export default function TutorialButton({
  onClick,
}: TutorialButtonProps) {
  const tooltipText = "Replay Tutorial";

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
