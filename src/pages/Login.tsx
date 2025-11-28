import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Login.module.css";

const Login = () => {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const isLoginDisabled = !email.trim() || !password.trim();

	const handleLogin = async () => {
		if (isLoginDisabled) return;
		try {
			await login({ email: email, password });
			navigate("/theme");
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response) {
					if (error.response.status === 400) {
						// bad request
						alert("모든 입력란을 올바르게 입력했는지 확인해주세요.");
					} else if (error.response.status === 401) {
						alert("유효하지 않은 이메일 혹은 비밀번호입니다.");
					} else if (error.response.status >= 500) {
						alert("서버 오류가 발생했습니다. 조금 이후 다시 시도해주세요.");
					} else {
						alert("로그인 도중 알 수 없는 오류가 발생했습니다");
					}
				} else if (error.request) {
					alert("서버와 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
				}
			} else {
				alert("오류가 발생했습니다.");
			}
			return;
		}
	};
	const handleNoAccount = () => {
		navigate("/signup");
	};

	return (
		<main className={styles.loginContainer}>
			<div className={styles.contentWrapper}>
				<div className={styles.formBox}>
					<div className={styles.formWrapper}>
						<h1 className={styles.loginTitle}>로그인하기</h1>
						<input
							type="email"
							placeholder="이메일"
							className={styles.input}
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<input
							type="password"
							placeholder="비밀번호"
							className={styles.input}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type="button"
							className={styles.loginButton}
							onClick={handleLogin}
							disabled={isLoginDisabled}
						>
							로그인하기
						</button>
						<button
							type="button"
							className={styles.noAccountButton}
							onClick={handleNoAccount}
						>
							계정이 없으신가요?
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};
export default Login;
