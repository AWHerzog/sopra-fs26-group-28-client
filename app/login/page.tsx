"use client"; // For components that need React hooks and browser APIs, SSR (server side rendering) has to be disabled. Read more here: https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering

import { useRouter } from "next/navigation"; // use NextJS router for navigation
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import styles from "@/styles/auth.module.css";
// Optionally, you can import a CSS module or file for additional styling:
// import styles from "@/styles/page.module.css";

interface FormFieldProps {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const router = useRouter();
  const apiService = useApi();
  const [form] = Form.useForm();
  const { set: setToken } = useSessionStorage<string>("token", "");
  const { set: setUsername } = useSessionStorage<string>("username", "");

  const handleLogin = async (values: FormFieldProps) => {
    try {
      const response = await apiService.post<User>("/users/login", values);

      if (response.token) {
        setToken(response.token);
      }
      if (response.username) {
        setUsername(response.username);
      }

      // Navigate to the user overview
      router.push("/index");
    } catch (error) {
      if (error instanceof Error) {
        alert(`Something went wrong during the login:\n${error.message}`);
      } else {
        console.error("An unknown error occurred during login.");
      }
    }
  };

  return (
    <div className={styles.pageBackground}>
      <div className={styles.authCard}>
        <div className={styles.brandBlock}>
          <div className={styles.badge}>D</div>
          <h1 className={styles.title}>Drigleit</h1>
          <p className={styles.subtitle}>Multiplayer Quiz Game</p>
        </div>

        <Form
          form={form}
          name="login"
          size="large"
          variant="outlined"
          onFinish={handleLogin}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter username" className={styles.inputField} />
          </Form.Item>
          <Form.Item
            name="password"
            label="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input placeholder="Enter Password" className={styles.inputField} />
          </Form.Item>
          <Form.Item className={styles.submitRow}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.primaryButton}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;