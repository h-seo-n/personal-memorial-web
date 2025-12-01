import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import itemGen1Svg from "/images/item-gen1.svg";
import styles from "../styles/Item-Gen.module.css";

const ItemGen = () => {
	const navigate = useNavigate();
	const [answer, setAnswer] = useState("");
	const [question] = useState("질문이 여기에 표시됩니다."); // TODO: 실제 질문으로 교체
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAnswer(e.target.value);
		// 입력 후 스크롤을 맨 아래로 이동 (마지막 줄만 보이게)
		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
			}
		}, 0);
	};

	const handleSubmit = () => {
		if (answer.trim()) {
			// TODO: 다음 질문으로 이동하거나 결과 처리 로직 구현
			// 예: setCurrentQuestionIndex(currentQuestionIndex + 1);
			// setAnswer("");
			console.log("답변 제출:", answer);
		}
	};

	const handleEndGeneration = () => {
		// TODO: 생성 종료 로직 구현
		navigate("/home");
	};

	// 답변이 변경될 때마다 스크롤을 맨 아래로
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
		}
	}, [answer]);

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
							ref={textareaRef}
							placeholder="답변을 입력해주세요!"
							className={styles.answerInput}
							value={answer}
							onChange={handleAnswerChange}
							rows={1}
						/>
						{/* Input Button */}
						<button
							type="button"
							className={styles.inputButton}
							onClick={handleSubmit}
							disabled={!answer.trim()}
						>
							입력
						</button>
					</div>
				</div>
			</div>
		</main>
	);
};

export default ItemGen;

