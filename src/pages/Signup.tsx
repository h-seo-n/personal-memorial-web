import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Signup.module.css";

const Signup = () => {
	const { signUp } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSignup = async () => {
		if (isSignupDisabled) return;
		try {
			await signUp({ email: email, password, name });
			navigate("/theme");
		} catch (error) {
			if (error.response) {
				if (isAxiosError(error)) {
					const status = error.response.status;
					const serverMessage = error.response.data?.message;

					if (status === 400) {
						// 400 Bad Request
						alert(
							serverMessage ||
								"모든 입력란을 올바르게 입력했는지 확인해주세요.",
						);
					} else if (status === 409) {
						// 409 Conflict
						alert("이미 사용 중인 이메일입니다.");
					} else if (status >= 500) {
						// 500 Internal server error
						alert("서버 상 오류가 발생했습니다. 조금 이후 다시 시도해주세요.");
					} else {
						alert("회원가입 중 알 수 없는 오류가 발생했습니다.");
					}
				} else if (error.request) {
				}
				alert("서버와 연결할 수 없습니다. 네트워크 연결을 확인해주세요.");
			} else {
				alert("실행 중 오류가 발생했습니다.");
			}
		}
	};

	const handleHasAccount = () => {
		navigate("/login");
	};

	const isSignupDisabled = !name.trim() || !email.trim() || !password.trim();

	return (
		<main className={styles.signupContainer}>
			<div className={styles.contentWrapper}>
				<h1>이제 시작해볼까요?</h1>
				<input
					type="text"
					placeholder="이름"
					className={styles.input}
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
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
					className={styles.signupButton}
					onClick={handleSignup}
					disabled={isSignupDisabled}
				>
					가입하기
				</button>
				<button
					type="button"
					className={styles.hasAccountButton}
					onClick={handleHasAccount}
				>
					이미 계정이 있으신가요?
				</button>
			</div>
		</main>
	);
};

export default Signup;
