import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import itemGen1Svg from "/images/item-gen1.svg";
import { useAuth } from "../contexts/AuthContext";
import { useObjects } from "../contexts/ObjectsContext";
import { getQuestionByIndex, getSecondQ } from "../shared/itemGeneration";
import type { BaseObject } from "../shared/types";
import styles from "../styles/Item-Gen.module.css";
import { LoginPromptModal } from "../widgets/LoginPromptModal";

const ItemGen = () => {
	const navigate = useNavigate();
	const [firstAnswer, setFirstAnswer] = useState("");
	const [secondAnswer, setSecondAnswer] = useState("");
	const { user } = useAuth();

	if (!user) {
		return (
			<main className={styles.itemGenContainer}>
				<LoginPromptModal />
			</main>
		);
	}

	const { addGenerated, generateObject, generateLoading } = useObjects();
	const [questionIndex, setQuestionIndex] = useState(
		() => user?.questionIndex ?? 0,
	);
	const [firstQuestion, setFirstQuestion] = useState(
		getQuestionByIndex(questionIndex),
	);
	const [secondQuestion, setSecondQuestion] = useState("");
	const [generatedObject, setGeneratedObject] = useState<BaseObject | null>(
		null,
	);

	const textRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setFirstQuestion(getQuestionByIndex(questionIndex));
	}, [questionIndex]);

	const handleFirstSubmit = async () => {
		// get second question
		const secondQ = await getSecondQ(firstAnswer, questionIndex);
		setSecondQuestion(secondQ);
	};

	const handleSecondSubmit = async () => {
		// generate object
		const obj = await generateObject(
			firstQuestion,
			firstAnswer,
			secondQuestion,
			secondAnswer,
		);
		setGeneratedObject(obj);
	};

	const handleAddItem = async () => {
		if (!generatedObject) return;
		await addGenerated(generatedObject.id);
		navigate("/home");
	};
	const handleRegenerate = () => {
		setSecondQuestion("");
		setGeneratedObject(null);
		setSecondAnswer("");
	};

	// 답변이 변경될 때마다 스크롤을 맨 아래로
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
		}
	}, [answer]);

	return (
		<main className={styles.itemGenContainer}>
			{/* Background blob */}

			{/* End Generation Button - Top Right */}
			<button
				type="button"
				className={styles.endButton}
				onClick={() => navigate("/home")}
			>
				생성 종료
			</button>

			{/* Center Container */}
			<div className={styles.contentWrapper}>
				<div className={styles.centerContainer}>
					{/* Question Display Area */}
					{generatedObject ? (
						<div>
							<h1 className={styles.titleText}>{generatedObject.name}</h1>
							<img
								className={styles.imgWrapper}
								src={generatedObject.currentImageSet.src}
								alt={`a ${generatedObject.name} with color ${generatedObject.currentImageSet.name}`}
							/>
							<p className={styles.bodyText}>{generatedObject.description}</p>
							<div className={styles.buttonRow}>
								<button
									type="button"
									className={styles.modalButton}
									onClick={handleAddItem}
								>
									내 아이템에 추가
								</button>
								<button
									type="button"
									className={styles.modalButton}
									onClick={handleRegenerate}
								>
									다시 생성하기
								</button>
							</div>
						</div>
					) : (
						<>
							{generateLoading ? (
								<h1 className={styles.questionText}>답변을 분석 중이에요</h1>
							) : (
								<div className={styles.questionArea}>
									<h1 className={styles.questionText}>
										{secondQuestion ? secondQuestion : firstQuestion}
									</h1>
								</div>
							)}
							{/* Answer Input Area */}
							{!generateLoading && (
								<div className={styles.answerArea}>
									<textarea
										ref={textRef}
										placeholder="답변을 입력해주세요!"
										className={styles.answerInput}
										value={secondQuestion ? secondAnswer : firstAnswer}
										onChange={(e) => {
											if (secondQuestion) {
												setSecondAnswer(e.target.value);
											} else {
												setFirstAnswer(e.target.value);
											}
										}}
										rows={1}
									/>
									{/* Input Button */}
									<button
										type="button"
										className={styles.inputButton}
										onClick={
											secondQuestion ? handleSecondSubmit : handleFirstSubmit
										}
										disabled={
											secondQuestion
												? !secondAnswer.trim()
												: !firstAnswer.trim()
										}
									>
										입력
									</button>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</main>
	);
};

export default ItemGen;
