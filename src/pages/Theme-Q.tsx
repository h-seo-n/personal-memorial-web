import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import themeSvg from "/images/theme.svg";
import themeGenSvg from "/images/themeGen.svg";
import { useAuth } from "../contexts/AuthContext";
import { type QA, useTheme } from "../contexts/ThemeContext";
import styles from "../styles/Theme-Q.module.css";

interface Question {
	question: string;
	example1: string;
	example2: string;
	headerText: string;
}

const QUESTIONS: Question[] = [
	{
		question: "어떤 칭찬을 들으면 기분이 좋던가요?",
		example1: "일 처리 방식이 깔끔하고 멋있다.",
		example2: "깊이가 있음.",
		headerText: "당신에게 어울리는 벽지는 뭘까요?",
	},
	{
		question: "평소에 무엇을 기대하며 살고 있나요?",
		example1: "새로운 도전과 성취감",
		example2: "감동적인 순간",
		headerText: "바닥재를 고르고 있어요!",
	},
	{
		question: "주변 사람들에게 어떻게 기억되고 싶은가요?",
		example1: "편안하고 자연스러운 사람",
		example2: "매력 있는 사람",
		headerText: "당신의 공간에 딱 맞는 가구를 준비할게요!",
	},
	{
		question: "나의 삶을 한 문장으로 정리하자면?",
		example1: "과정 안에서 의미를 수집하는 삶",
		example2: "소소한 행복을 소중히 여긴다",
		headerText: "소품은 어떤 걸 둘까요?",
	},
	{
		question: "당신의 장례식은 분위기가 어땠으면 하나요?",
		example1: "나에 대한 기억을 나누는 차분한 자리",
		example2: "숲 속 느낌",
		headerText: "주변 풍경도 생각해볼게요!",
	},
];

const ThemeQ = () => {
	const { analyzeTheme, themeLoading } = useTheme();
	const { fetchUser, user } = useAuth();

	const navigate = useNavigate();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState("");
	const [answers, setAnswers] = useState<string[]>([]);

	const [showTextSection, setShowTextSection] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [resultReason, setResultReason] = useState("");
	const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const currentQuestion = QUESTIONS[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
	const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

	const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setAnswer(e.target.value);
		// 입력 후 스크롤을 맨 아래로 이동 (마지막 줄만 보이게)
		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
			}
		}, 0);
	};

	const handleNext = async () => {
		if (answer.trim()) {
			const updatedAnswers = [...answers, answer.trim()];
			setAnswers(updatedAnswers);

			if (isLastQuestion) {
				// 마지막 질문이면 먼저 텍스트 섹션 표시
				setShowTextSection(true);
			} else {
				// 다음 질문으로 이동
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setAnswer(""); // 답변 초기화
			}
		}
	};

	// 텍스트 섹션이 표시되면 자동으로 분석 시작
	useEffect(() => {
		const startAnalysis = async () => {
			if (showTextSection && answers.length === QUESTIONS.length) {
				const query: QA[] = QUESTIONS.map((q, idx) => ({
					question: q.question,
					answer: answers[idx],
				}));
				const { themeMeta, reason } = await analyzeTheme(query);
				setResultReason(reason);
				setResultImageUrl(`/images/theme${themeMeta.id}.png`);
				
				// analyzeTheme 완료 후 3초 후에 결과 페이지로 이동
				setTimeout(() => {
					setShowTextSection(false);
					setShowResult(true);
				}, 3000);
			}
		};

		startAnalysis();
	}, [showTextSection, answers, analyzeTheme]);

	// 결과 페이지가 표시되면 3초 후 자동으로 Home으로 이동
	useEffect(() => {
		const run = async () => {
			if (showResult) {
				await fetchUser();
				console.log(user.theme);

				const timer = setTimeout(() => {
					navigate("/home");
				}, 3000);

				return () => clearTimeout(timer);
			}
		};

		run();
	}, [showResult, navigate, fetchUser, user]);

	// 텍스트 섹션 화면 (마지막 질문 이후)
	if (showTextSection) {
		return (
			<main className={styles.textSectionContainer}>
				{/* Background Image */}
				<img
					src={themeSvg}
					alt="Theme Background"
					className={styles.textSectionBackgroundImage}
				/>

				{/* Text Section */}
				<div className={styles.textSectionWrapper}>
					<div className={styles.textSectionBox}>
						<p className={styles.textSectionContent}>
							답변을 분석 중이에요.
						</p>
					</div>
				</div>
			</main>
		);
	}

	// 결과 페이지
	if (showResult) {
		return (
			<main className={styles.resultContainer}>
				{/* Background Image */}
				<img
					src={themeGenSvg}
					alt="Theme Generation Background"
					className={styles.resultBackgroundImage}
				/>

				{/* Content Wrapper */}
				<div className={styles.resultContentWrapper}>
					{/* Description Section */}
					<div className={styles.resultDescription}>
						<p>{resultReason}</p>
					</div>

					{/* Generated Image Section */}
					<div className={styles.resultImageContainer}>
						<img
							src={resultImageUrl}
							alt="Generated Theme"
							className={styles.resultImage}
						/>
					</div>
				</div>
			</main>
		);
	}

	// 분석 중 화면
	if (themeLoading) {
		return (
			<main className={styles.analyzingContainer}>
				<div className={styles.analyzingWrapper}>
					<img
						src={themeSvg}
						alt="loading page for analyzing theme"
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
					<div className={styles.icon} />
					<div className={styles.headerText}>{currentQuestion.headerText}</div>
				</div>
				<div className={styles.progressBar}>
					<div
						className={styles.progressFill}
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>

			{/* Main Content */}
			<div className={styles.contentWrapper}>
				{/* Question Box */}
				<div className={styles.questionBox}>
					<h1 className={styles.questionTitle}>
						{currentQuestion.question.split("\n").map((line, index) => (
							<span key={`${currentQuestion.question}-${line}-${index}`}>
								{line}
								{index < currentQuestion.question.split("\n").length - 1 && (
									<br />
								)}
							</span>
						))}
					</h1>
				</div>

				{/* Example Answers */}
				<div className={styles.examplesWrapper}>
					<div className={styles.exampleText}>{currentQuestion.example1}</div>
					<div className={styles.exampleText}>{currentQuestion.example2}</div>
				</div>

				{/* Answer Input */}
				<textarea
					ref={textareaRef}
					placeholder="답변을 입력해주세요!"
					className={styles.answerInput}
					value={answer}
					onChange={handleAnswerChange}
					rows={1}
				/>

				{/* Next Button */}
				<button
					type="button"
					className={styles.nextButton}
					onClick={handleNext}
					disabled={!answer.trim()}
				>
					입력
				</button>
			</div>
		</main>
	);
};

export default ThemeQ;


