import { useNavigate } from "react-router-dom";
import mainSvg from "/main.svg";
import styles from "../styles/Main.module.css";

const Main = () => {
	const navigate = useNavigate();

	const handleCreateMemorial = () => {
		navigate("/login");
	};

	return (
		<main className={styles.mainContainer}>
			<div className={styles.contentWrapper}>
				<img src={mainSvg} alt="내일의 나에게" className={styles.mainImage} />
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

