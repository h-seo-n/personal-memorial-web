import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

const Login = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		if (username.trim() && password.trim()) {
			navigate("/theme");
		}
	};

	const handleNoAccount = () => {
		navigate("/signup");
	};

	const isLoginDisabled = !username.trim() || !password.trim();

	return (
		<main className={styles.loginContainer}>
			<div className={styles.contentWrapper}>
				<div className={styles.formBox}>
					<div className={styles.formWrapper}>
						<h1 className={styles.loginTitle}>로그인하기</h1>
						<input
							type="text"
							placeholder="아이디"
							className={styles.input}
							value={username}
							onChange={(e) => setUsername(e.target.value)}
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
