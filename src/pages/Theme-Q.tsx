import { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme4Svg from "/images/theme4.svg";
import styles from "../styles/Theme-Q.module.css";

interface Question {
	question: string;
	example1: string;
	example2: string;
}

const questions: Question[] = [
	{
		question: "어떤 칭찬을 들으면 기분이 좋나요?",
		example1: "일 처리 방식이 깔끔하고 멋있다.",
		example2: "깊이가 있음.",
	},
	{
		question: "평소에 무엇을 기대하며 살고 있나요?",
		example1: "새로운 도전과 성취감",
		example2: "감동적인 순간",
	},
	{
		question: "주변 사람들에게 어떻게 기억되고 싶나요?",
		example1: "편안하고 자연스러운 사람",
		example2: "매력 있는 사람",
	},
	{
		question: "나의 삶을 한 문장으로 정리하자면?",
		example1: "과정 안에서 의미를 수집하는 삶",
		example2: "소소한 행복을 소중히 여긴다",
	},
	{
		question: "당신의 장례식은 분위기가 어땠으면 하나요?",
		example1: "나에 대한 기억을 나누는 차분한 자리",
		example2: "숲 속 느낌",
	},
];

const ThemeQ = () => {
	const navigate = useNavigate();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState("");
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	const currentQuestion = questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === questions.length - 1;
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

	const handleNext = () => {
		if (answer.trim()) {
			if (isLastQuestion) {
				// 마지막 질문이면 분석 중 화면 표시
				setIsAnalyzing(true);
				// 3초 후 홈으로 이동
				setTimeout(() => {
					navigate("/home");
				}, 3000);
			} else {
				// 다음 질문으로 이동
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setAnswer(""); // 답변 초기화
			}
		}
	};

	// 분석 중 화면
	if (isAnalyzing) {
		return (
			<main className={styles.analyzingContainer}>
				<div className={styles.analyzingWrapper}>
					<img
						src={theme4Svg}
						alt="Theme 4"
						className={styles.analyzingImage}
					/>
				</div>
			</main>
		);
	}

	return (
		<main className={styles.themeQContainer}>
			{/* Header Section */}
			<div className={styles.header}>
				<div className={styles.headerLeft}>
					<div className={styles.icon}>💭</div>
					<div className={styles.headerText}>날씨를 고르고 있어요!</div>
				</div>
				<div className={styles.progressBar}>
					<div 
						className={styles.progressFill}
						style={{ width: `${progress}%` }}
					></div>
				</div>
			</div>

			{/* Main Content */}
			<div className={styles.contentWrapper}>
				{/* Question Box */}
				<div className={styles.questionBox}>
					<h1 className={styles.questionTitle}>
						{currentQuestion.question.split('\n').map((line, index) => (
							<span key={index}>
								{line}
								{index < currentQuestion.question.split('\n').length - 1 && <br />}
							</span>
						))}
					</h1>
				</div>

				{/* Example Answers */}
				<div className={styles.examplesWrapper}>
					<div className={styles.exampleText}>
						{currentQuestion.example1}
					</div>
					<div className={styles.exampleText}>
						{currentQuestion.example2}
					</div>
				</div>

				{/* Answer Input */}
				<textarea
					placeholder="답변을 입력해주세요!"
					className={styles.answerInput}
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					rows={4}
				/>

				{/* Next Button */}
				<button
					type="button"
					className={styles.nextButton}
					onClick={handleNext}
					disabled={!answer.trim()}
				>
					{isLastQuestion ? "완료" : "다음"}
				</button>
			</div>
		</main>
	);
};

export default ThemeQ;

