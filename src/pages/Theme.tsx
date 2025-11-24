import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme1Svg from "/images/theme1.svg";
import theme2Svg from "/images/theme2.svg";
import theme3Svg from "/images/theme3.svg";
import styles from "../styles/Theme.module.css";

const Theme = () => {
	const navigate = useNavigate();
	const [currentTheme, setCurrentTheme] = useState<1 | 2 | 3>(1);

	const handleThemeChange = () => {
		if (currentTheme === 3) {
			navigate("/theme-q");
		} else {
			setCurrentTheme(currentTheme === 1 ? 2 : 3);
		}
	};

	return (
		<main className={styles.themeContainer}>
			<div className={styles.contentWrapper}>
				<img
					src={currentTheme === 1 ? theme1Svg : currentTheme === 2 ? theme2Svg : theme3Svg}
					alt={currentTheme === 1 ? "Theme 1" : currentTheme === 2 ? "Theme 2" : "Theme 3"}
					className={currentTheme === 1 ? styles.theme1Image : currentTheme === 2 ? styles.theme2Image : styles.theme3Image}
				/>
				<button
					type="button"
					className={styles.themeButton}
					onClick={handleThemeChange}
				>
					&gt;
				</button>
			</div>
		</main>
	);
};

export default Theme;

