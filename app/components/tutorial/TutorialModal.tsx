"use client";

import React from "react";
import { Modal, Button, Steps, Row, Col } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { TUTORIAL_STEPS } from "./TutorialSteps";
import styles from "./TutorialModal.module.css";

interface TutorialModalProps {
  isOpen: boolean;
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onClose: () => void;
}

export default function TutorialModal({
  isOpen,
  currentStep,
  onNext,
  onPrev,
  onComplete,
  onClose,
}: TutorialModalProps) {
  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      onNext();
    }
  };

  return (
    <Modal
      title={step?.title}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      closable
    >
      {step && (
        <div className={styles.tutorialContent}>
          {/* Progress indicator */}
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{
                width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
              }}
            />
          </div>

          <p className={styles.stepCounter}>
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </p>

          {/* Main content */}
          <div className={styles.contentArea}>{step.content}</div>

          {/* Steps indicator */}
          <div className={styles.stepsContainer}>
            <Steps
              size="small"
              current={currentStep}
              items={TUTORIAL_STEPS.map(() => ({
                title: "",
              }))}
            />
          </div>

          {/* Navigation buttons */}
          <Row gutter={16} className={styles.buttonContainer}>
            <Col span={12}>
              <Button
                onClick={onPrev}
                disabled={isFirstStep}
                block
                icon={<LeftOutlined />}
              >
                Previous
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                onClick={handleNext}
                block
                icon={isLastStep ? undefined : <RightOutlined />}
              >
                {isLastStep ? "Start Playing!" : "Next"}
              </Button>
            </Col>
          </Row>

          {/* Skip button */}
          <div className={styles.skipButtonContainer}>
            <Button type="text" size="small" onClick={onClose}>
              Skip Tutorial
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
