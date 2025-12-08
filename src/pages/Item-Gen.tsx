import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import itemGen1Svg from "/images/item-gen1.svg";
import { useAuth } from "../contexts/AuthContext";
import { useItemGen } from "../contexts/ItemGenContext";
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
	const [questionIndex] = useState(() => user?.questionIndex ?? 0);
	const [firstQuestion, setFirstQuestion] = useState(
		getQuestionByIndex(questionIndex),
	);
	const [secondQuestion, setSecondQuestion] = useState("");
	const [generatedObject, setGeneratedObject] = useState<BaseObject | null>(
		null,
	);
	const [questionLoading, setQuestionLoading] = useState<boolean>(false);

	const textRef = useRef<HTMLTextAreaElement>(null);

	// tooltip
	const { setJustGenerated, setOntype } = useItemGen();

	useEffect(() => {
		setFirstQuestion(getQuestionByIndex(questionIndex));
	}, [questionIndex]);

	const handleFirstSubmit = async () => {
		// get second question
		setQuestionLoading(true);

		const secondQ = await getSecondQ(firstAnswer, questionIndex);
		setQuestionLoading(false);

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
		setJustGenerated(true);
		setOntype(generatedObject.ontype === "Floor" ? "Floor" : "Wall");
		navigate("/home");
	};
	const handleRegenerate = () => {
		setSecondQuestion("");
		setGeneratedObject(null);
		setSecondAnswer("");
	};

	/* Random text while loading */
	const RANDOM_TEXT = [
		"어떤 아이템이 괜찮을까요?",
		"당신의 추억을 가득 담고 있어요.",
		"이런 색이 잘 어울릴 것 같아요.",
		"따뜻했던 순간을 떠올리는 중이에요.",
		"곧, 당신만의 이야기가 아이템으로 바뀔 거에요.",
		"기억 속 분위기를 담아내고 있어요.",
	];
	const [remainingText, setRemainingText] = useState(RANDOM_TEXT);
	const [currentRandomText, setCurrentRandomText] = useState<string | null>(
		null,
	);

	useEffect(() => {
		const pool = remainingText.length === 0 ? RANDOM_TEXT : remainingText;

		const timer = setTimeout(() => {
			const idx = Math.floor(Math.random() * pool.length);
			const selected = pool[idx];

			setCurrentRandomText(selected);
			setRemainingText(pool.filter((_, i) => i !== idx));
		}, 2500);

		return () => clearTimeout(timer);
	}, [remainingText]);

	return (
		<main className={styles.itemGenContainer}>
			{/* Background blob */}

			{/* End Generation Button - Top Right */}
			<button
				type="button"
				className={styles.endButton}
				onClick={() => navigate("/home")}
			>
				편집 종료
			</button>

			{/* Center Container */}
			<div className={styles.contentWrapper}>
				<div className={styles.centerContainer}>
					{/* Question Display Area */}
					{generatedObject ? (
						<div className={styles.resultWrapper}>
							<h1 className={styles.titleText}>{generatedObject.name}</h1>
							<span className={styles.randomText}>
								{generatedObject.ontype === "Floor"
									? "바닥에 둘 수 있어요!"
									: "벽에 걸 수 있어요!"}
							</span>
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
							{generateLoading || questionLoading ? (
								<div>
									<h1 className={styles.questionText}>답변을 분석 중이에요</h1>
									{generateLoading && (
										<span className={styles.randomText}>
											{currentRandomText}
										</span>
									)}
								</div>
							) : (
								<div className={styles.questionArea}>
									<h1 className={styles.questionText}>
										{secondQuestion ? secondQuestion : firstQuestion}
									</h1>
								</div>
							)}
							{/* Answer Input Area */}
							{!(generateLoading || questionLoading) && (
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
