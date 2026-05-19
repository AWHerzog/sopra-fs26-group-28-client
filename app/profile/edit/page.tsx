"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import useLocalStorage from "@/hooks/useLocalStorage";
import { User } from "@/types/user";
import { App, Button, Form, Input } from "antd";
import styles from "@/styles/auth.module.css";

const AVATAR_STYLES = [
  { key: "pixel-art", label: "Pixel Art" },
] as const;

type AvatarStyle = (typeof AVATAR_STYLES)[number]["key"];

function dicebearUrl(seed: string, style: AvatarStyle) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed || "default")}`;
}

const Settings: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const { set: setStoredUsername } = useSessionStorage<string>("username", "");
  const { value: avatarStyle, set: setAvatarStyle } = useLocalStorage<AvatarStyle>("avatarStyle", "pixel-art");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewSeed, setPreviewSeed] = useState("default");
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const rawToken = sessionStorage.getItem("token");
    const rawUserId = sessionStorage.getItem("userId");
    const tok = rawToken ? JSON.parse(rawToken) : "";
    const uid = rawUserId ? JSON.parse(rawUserId) : "";

    if (!tok || !uid) {
      router.push("/login");
      return;
    }

    setToken(tok);
    setUserId(uid);

    apiService
      .get<User>(`/users/${uid}`, { Authorization: tok })
      .then((data) => {
        form.setFieldsValue({ username: data.username });
        setPreviewSeed(data.username ?? "default");
      })
      .catch(() => message.error("Failed to load profile"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (values: { username: string }) => {
    if (!userId) return;
    setSaving(true);
    try {
      const updated = await apiService.put<User>(
        `/users/${userId}`,
        { username: values.username },
        { Authorization: token },
      );
      if (updated.username) {
        setStoredUsername(updated.username);
      }
      router.push("/home");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save profile");
      setSaving(false);
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.authCard} style={{ maxWidth: 480 }}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your profile</p>
        </div>

        {/* Avatar preview */}
        <div className={styles.avatarSection}>
          <img
            src={dicebearUrl(previewSeed, avatarStyle)}
            alt="Avatar preview"
            className={styles.avatarPreview}
          />
          <div className={styles.styleGrid}>
            {AVATAR_STYLES.map((s) => (
              <button
                key={s.key}
                type="button"
                className={`${styles.styleBtn} ${avatarStyle === s.key ? styles.styleBtnActive : ""}`}
                onClick={() => setAvatarStyle(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile form — always rendered so form instance stays connected */}
        <Form
          form={form}
          name="settings"
          size="large"
          variant="outlined"
          layout="vertical"
          className={styles.form}
          onFinish={handleSave}
          onValuesChange={(changed) => {
            if (changed.username !== undefined) {
              setPreviewSeed(changed.username || "default");
            }
          }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Username is required" },
              { max: 30, message: "At most 30 characters" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "Only letters, numbers and underscores allowed",
              },
            ]}
          >
            <Input
              placeholder="Your username"
              className={styles.inputField}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item className={styles.submitRow}>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              disabled={loading}
              className={styles.primaryButton}
            >
              Save Changes
            </Button>
            <Button
              type="default"
              onClick={() => router.push("/home")}
              style={{ marginLeft: 8 }}
            >
              Back
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
