import styles from "../styles/ConfigModal.module.css";

export const LoginPromptModal = () => {
	return (
		<div className={styles.modalWrapper}>
			<h1 className={styles.title}>
				서비스 이용을 위해서는 로그인/회원가입을 해주세요.
			</h1>
		</div>
	);
};
