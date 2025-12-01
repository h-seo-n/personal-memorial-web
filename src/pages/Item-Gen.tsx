import { useState } from "react";
import { useNavigate } from "react-router-dom";
import itemGen1Svg from "/images/item-gen1.svg";
import styles from "../styles/Item-Gen.module.css";

const ItemGen = () => {
	const navigate = useNavigate();
	const [answer, setAnswer] = useState("");
	const [question] = useState("질문이 여기에 표시됩니다."); // TODO: 실제 질문으로 교체

	const handleEndGeneration = () => {
		// TODO: 생성 종료 로직 구현
		navigate("/home");
	};

	return (
		<main className={styles.itemGenContainer}>
			{/* Background Image */}
			<img
				src={itemGen1Svg}
				alt="Item Generation Background"
				className={styles.backgroundImage}
			/>

			{/* End Generation Button - Top Right */}
			<button
				type="button"
				className={styles.endButton}
				onClick={handleEndGeneration}
			>
				생성 종료
			</button>

			{/* Center Container */}
			<div className={styles.contentWrapper}>
				<div className={styles.centerContainer}>
					{/* Question Display Area */}
					<div className={styles.questionArea}>
						<h1 className={styles.questionText}>{question}</h1>
					</div>

					{/* Answer Input Area */}
					<div className={styles.answerArea}>
						<textarea
							placeholder="답변을 입력해주세요!"
							className={styles.answerInput}
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							rows={4}
						/>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ItemGen;

