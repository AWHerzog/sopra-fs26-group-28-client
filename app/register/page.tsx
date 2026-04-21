"use client";

import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import useSessionStorage from "@/hooks/useSessionStorage";
import { User } from "@/types/user";
import { Button, Form, Input } from "antd";
import styles from "@/styles/auth.module.css";

interface RegistrationFormProps {
	username: string;
	password: string;
}

const Registration: React.FC = () => {
	const router = useRouter();
	const apiService = useApi();
	const [form] = Form.useForm();
	const { set: setToken } = useSessionStorage<string>("token", "");
	const { set: setUsername } = useSessionStorage<string>("username", "");

	const handleRegistration = async (values: RegistrationFormProps) => {
		try {
			const payload = {
				username: values.username,
				password: values.password,
			};

			const response = await apiService.post<User>("/users", payload);

			if (response.token) {
				setToken(response.token);
			}
			if (response.username) {
				setUsername(response.username);
			}

			router.push("/index");
			
		} catch (error) {
			if (error instanceof Error) {
				alert(`Something went wrong during registration:\n${error.message}`);
			} else {
				console.error("An unknown error occurred during registration.");
			}
		}
	};

	return (
		<div className={styles.pageBackground}>
			<div className={styles.authCard}>
				<div className={styles.brandBlock}>
					<div className={styles.badge}>D</div>
					<h1 className={styles.title}>Create Account</h1>
					<p className={styles.subtitle}>Join the Drigleit multiplayer quiz</p>
				</div>

				<Form
					form={form}
					name="registration"
					size="large"
					variant="outlined"
					onFinish={handleRegistration}
					layout="vertical"
					className={styles.form}
				>
					<Form.Item
						name="username"
						label="Username"
						rules={[{ required: true, message: "Please input your username!" }]}
					>
						<Input placeholder="Choose a username" className={styles.inputField} />
					</Form.Item>

					<Form.Item
						name="password"
						label="Password"
						rules={[{ required: true, message: "Please input your password!" }]}
					>
						<Input.Password
							placeholder="Choose a password"
							className={styles.inputField}
						/>
					</Form.Item>

					<Form.Item className={styles.submitRow}>
						<Button type="primary" htmlType="submit" className={styles.primaryButton}>
							Register
						</Button>
					</Form.Item>

					<p className={styles.switchRow}>
						Already have an account?
						<Button
							type="link"
							className={styles.switchButton}
							onClick={() => router.push("/login")}
						>
							Log in
						</Button>
					</p>
				</Form>
			</div>
		</div>
	);
};

export default Registration;
