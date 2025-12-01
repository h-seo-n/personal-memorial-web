import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/ConfigModal.module.css";

export const LoginPromptModal = () => {
	const { user, isLoading } = useAuth();

	return (
		<>
			{!isLoading && !user && (
				<div className={styles.modalWrapper}>
					<h2 className={styles.titleText} style={{ textAlign: "center" }}>
						서비스 이용을 위해서는
						<br />
						로그인이 필요해요!
					</h2>
					<button type="button" className={styles.delBtn} id={styles.delete}>
						로그인하기
					</button>
					<button type="button" className={styles.delBtn}>
						회원가입하기
					</button>
				</div>
			)}
		</>
	);
};
