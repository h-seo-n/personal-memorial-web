import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import themeSvg from "/images/theme.svg";
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

	// 각 테마별 텍스트
	const themeTexts = {
		1: "만나서 반가워요!",
		2: "이제부터, 당신이 세상을 떠난 뒤\n사람들이 찾아올 추모관을 만들 거에요.",
		3: "몇 가지 질문으로 공간을 설정해볼게요!\n 지금 결정된 요소는 언제든 변경할 수 있어요.",
	};

	const currentText = themeTexts[currentTheme];

	return (
		<main className={styles.themeContainer}>
			<div className={styles.contentWrapper}>
				<img
					src={themeSvg}
					alt="Theme"
					className={styles.themeImage}
				/>
				{/* 텍스트 구간 */}
				<div className={styles.textSection}>
					<p className={styles.textContent}>
						{currentText.split('\n').map((line, index, array) => (
							<React.Fragment key={index}>
								{line}
								{index < array.length - 1 && <br />}
							</React.Fragment>
						))}
					</p>
				</div>
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
