import { useNavigate } from "react-router-dom";
import mainSvg from "/images/main.svg";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/Main.module.css";

const Main = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const handleCreateMemorial = () => {
		if (user) navigate("/home");
		else {
			navigate("/login");
		}
	};

	return (
		<main className={styles.mainContainer}>
			<div className={styles.mainContent}>
				<img src={mainSvg} alt="내일의 나에게" className={styles.mainImage} />
			</div>
			<div className={styles.contentWrapper}>
				<h1>내일의 나에게</h1>
				<button
					type="button"
					className={styles.createButton}
					onClick={handleCreateMemorial}
				>
					내 추모관 만들기
				</button>
			</div>
		</main>
	);
};

export default Main;
