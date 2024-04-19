import { Button, Spin, Form, Input, message } from "antd";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "./components/Slider";
import { loginBySlider } from "@/api/user";
import { setUserToken } from "@/store/modules/user";
import styles from "./index.module.scss";
const Login = () => {
  const [showSlider, setShowSlider] = useState(false);

  const formData = useRef({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 表单提交
  const onFinish = (values) => {
    setShowSlider(true);
    formData.current = values;
  };

  // 登录
  const handleLogin = (movePercent, uuid) => {
    setLoading(true);
    return new Promise((resolve) => {
      const params = {
        code: movePercent.toFixed(6),
        key: uuid,
        tenantId: "000000",
        ...formData.current
      };
      loginBySlider(params)
        .then(
          ({ status, data }) => {
            resolve(status);
            dispatch(setUserToken(data.access_token));
            setTimeout(() => {
              navigate("/desk/notice");
            });
          },
          ({ status, data }) => {
            resolve(status);
            message.error(data);
          }
        )
        .finally(() => {
          setLoading(false);
        });
    });
  };
  return (
    <div className={styles.loginContainer}>
      <Spin spinning={loading}>
        <div className={styles.loginBox}>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
          {showSlider && (
            <div className={styles.sliderContainer}>
              <Slider onValid={handleLogin} onClose={() => setShowSlider(false)} />
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
};

export default Login;
