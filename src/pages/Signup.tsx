import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupSvg from "/signup.svg";
import styles from "../styles/Signup.module.css";

const Signup = () => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSignup = () => {
		if (name.trim() && username.trim() && password.trim()) {
			navigate("/theme");
		}
	};

	const handleHasAccount = () => {
		navigate("/login");
	};

	const isSignupDisabled = !name.trim() || !username.trim() || !password.trim();

	return (
		<main className={styles.signupContainer}>
			<div className={styles.contentWrapper}>
				<img src={signupSvg} alt="Signup" className={styles.signupImage} />
				<div className={styles.formWrapper}>
					<input
						type="text"
						placeholder="이름"
						className={styles.input}
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
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
			</div>
		</main>
	);
};

export default Signup;
