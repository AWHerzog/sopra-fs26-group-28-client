"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import { User } from "@/types/user";
import { Button, Card, Form, Input, message } from "antd";
import styles from "@/styles/auth.module.css";

interface ProfileFormData {
  username: string;
  name?: string;
}

const ProfileEdit: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { value: token } = useSessionStorage<string>("token", "");
  const { value: storedUsername } = useSessionStorage<string>("username", "");
  const { value: userId } = useSessionStorage<string>("userId", "");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Load current user data
  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        message.error("User ID not found. Please login again.");
        router.push("/login");
        return;
      }

      try {
        const userData = await apiService.get<User>(`/users/${userId}`, {
          Authorization: `Bearer ${token}`,
        });
        setUser(userData);
        form.setFieldsValue({
          username: userData.username,
          name: userData.name,
        });
      } catch (error) {
        console.error("Failed to load user data:", error);
        message.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    if (token && userId) {
      loadUser();
    } else if (!token) {
      router.push("/login");
    }
  }, [token, userId, apiService, form, router]);

  const handleUpdateProfile = async (values: ProfileFormData) => {
    if (!user?.id) return;

    setUpdating(true);
    try {
      const updatedUser = await apiService.put<User>(`/users/${user.id}`, values, {
        Authorization: `Bearer ${token}`,
      });

      // Update stored username if it changed
      if (updatedUser.username !== storedUsername) {
        // Note: We would need to update session storage here
        // But useSessionStorage doesn't provide a direct way, we'd need a custom hook
      }

      message.success("Profile updated successfully");
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile:", error);
      message.error("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className={styles.pageBackground}>
      <div className={styles.authCard}>
        <div className={styles.brandBlock}>
          <h1 className={styles.title}>Edit Profile</h1>
          <p className={styles.subtitle}>Update your profile information</p>
        </div>

        <Card title="Profile Information" style={{ width: "100%" }}>
          <Form
            form={form}
            name="profile"
            size="large"
            variant="outlined"
            onFinish={handleUpdateProfile}
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                { required: true, message: "Please input your username!" },
                { min: 3, message: "Username must be at least 3 characters" },
              ]}
            >
              <Input placeholder="Enter username" className={styles.inputField} />
            </Form.Item>

            <Form.Item
              name="name"
              label="Display Name"
              rules={[
                { required: false },
              ]}
            >
              <Input placeholder="Enter display name" className={styles.inputField} />
            </Form.Item>

            <Form.Item className={styles.submitRow}>
              <Button
                type="primary"
                htmlType="submit"
                loading={updating}
                className={styles.primaryButton}
              >
                Update Profile
              </Button>
              <Button
                type="default"
                onClick={() => router.back()}
                style={{ marginLeft: 8 }}
              >
                Cancel
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileEdit;