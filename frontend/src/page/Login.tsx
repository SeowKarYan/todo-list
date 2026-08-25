import { Button, Card, Form, Input, Typography, message } from "antd";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../redux/services/authApi";
import type { loginRequest } from "../types/auth";

const { Title } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const onFinish = async (values: loginRequest) => {
        try {
            await login(values).unwrap();
            navigate("/list");
        } catch (error) {
            let errorMessage = "Login failed. Check your username and password.";
            if (error && typeof error === "object" && "data" in error && error.data && typeof error.data === "object" && "message" in error.data && typeof error.data.message === "string") {
                errorMessage = error.data.message;
            } else if (error && typeof error === "string") {
                errorMessage = error;
            }
            message.error(errorMessage);
        }
    };

    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                backgroundColor: "#f0f2f5",
            }}
        >
            <Card style={{ width: 360, textAlign: "left" }}>
                <Title level={2} style={{ marginTop: 0, textAlign: "center" }}>
                    Login
                </Title>
                <Form layout="vertical" onFinish={onFinish} autoComplete="off">
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please enter your username" }]}
                    >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please enter your password" }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit" block loading={isLoading}>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
