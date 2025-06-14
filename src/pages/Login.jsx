import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/beranda", { replace: true });
    }
  }, [navigate]);

  const onFinish = (values) => {
    setLoading(true);

    // Simulasi proses login
    setTimeout(() => {
      // Hardcoded credentials
      if (values.username === "admin" && values.password === "admin123") {
        // Simpan status login ke localStorage
        localStorage.setItem("isLoggedIn", "true");
        message.success("Login berhasil!");
        navigate("/beranda", { replace: true });
      } else {
        message.error("Username atau password salah!");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "white",
      }}
    >
      {/* Left section for the image */}
      <div
        style={{
          width: "50%",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#000",
        }}
      >
        <img src="/Login.png" alt="Login Background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* Right section for the login form */}
      <div
        style={{
          width: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 400,
            padding: "40px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img src="/Essential Video.png" alt="Essential Video Logo" style={{ width: "180px", marginBottom: "20px" }} />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "5px", textAlign: "left" }}>Selamat Datang Kembali di Essential Video!</h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "30px", textAlign: "left" }}>Masuk ke akun Anda</p>

          <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: "Silakan masukkan username!" }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" size="large" style={{ borderRadius: "5px" }} />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Silakan masukkan password!" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" style={{ borderRadius: "5px" }} iconRender={(visible) => (visible ? <EyeOutlined /> : <EyeInvisibleOutlined />)} />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Checkbox>Ingat saya</Checkbox>
                <a href="" style={{ color: "#666" }}>
                  Lupa password?
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ backgroundColor: "#EA4D1E", borderColor: "#EA4D1E", borderRadius: "5px", height: "45px", marginTop: "20px" }}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
