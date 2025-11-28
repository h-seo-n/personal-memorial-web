import styles from "../styles/ConfigModal.module.css";

export const LoginPromptModal = () => {
	return (
		<div className={styles.modalWrapper}>
			<h1 className={styles.title}>
				서비스 이용을 위해서는 로그인이 필요해요!
			</h1>
			<button type="button" className={styles.btn}>
				로그인하기
			</button>
			<button type="button" className={styles.btn}>
				회원가입하기
			</button>
		</div>
	);
};
