import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import themeSvg from "/images/theme.svg";
import { useAuth } from "../contexts/AuthContext";
import { type QA, useTheme } from "../contexts/ThemeContext";
import styles from "../styles/Theme-Q.module.css";

interface Question {
	question: string;
	example1: string;
	example2: string;
	headerText: string;
	tip?: string; // 각 질문마다 다른 tip을 설정할 수 있음
	label?: string; // 리뷰 페이지에서 표시할 짧은 라벨
}

const QUESTIONS: Question[] = [
	{
		question: "어떤 칭찬을 들으면 기분이 좋던가요?",
		example1: "일 처리 방식이 깔끔하고 멋있다.",
		example2: "깊이가 있음.",
		headerText: "당신에게 어울리는 벽지는 뭘까요?",
		tip: "이 질문을 통해, {name} 님이 중요하게 생각하는 가치를 알 수 있어요.",
		label: "기분 좋은 칭찬",
	},
	{
		question: "평소에 무엇을 기대하며 살고 있나요?",
		example1: "새로운 도전과 성취감",
		example2: "감동적인 순간",
		headerText: "바닥재를 고르고 있어요!",
		tip: "이 질문을 통해, {name} 님 삶의 원동력을 파악할 수 있어요.",
		label: "기대하며 사는 것",
	},
	{
		question: "주변 사람들에게 어떻게 기억되고 싶은가요?",
		example1: "편안하고 자연스러운 사람",
		example2: "매력 있는 사람",
		headerText: "당신의 공간에 딱 맞는 가구를 준비할게요!",
		tip: "이 질문을 통해, {name} 님이 타인에게 어떤 모습을 보여주고 싶었는지 가늠할 수 있어요.",
		label: "기억될 모습",
	},
	{
		question: "나의 삶을 한 문장으로 정리하자면?",
		example1: "과정 안에서 의미를 수집하는 삶",
		example2: "소소한 행복을 소중히 여긴다",
		headerText: "소품은 어떤 걸 둘까요?",
		tip: "이 질문을 통해, {name} 님께 소중한 기억이 무엇인지 알 수 있어요.",
		label: "나의 삶은 ...",
	},
	{
		question: "당신의 장례식은 분위기가 어땠으면 하나요?",
		example1: "나에 대한 기억을 나누는 차분한 자리",
		example2: "숲 속 느낌",
		headerText: "주변 풍경도 생각해볼게요!",
		tip: "이 질문을 통해, {name} 삶과 죽음에 대한 태도를 알 수 있어요.",
		label: "나의 장례식",
	},
];

const THEMES: string[] = ["young", "romantic", "city", "nature", "memory"];

const ThemeQ = () => {
	const { analyzeTheme, saveTheme, themeLoading, analysisLoading } = useTheme();
	const { fetchUser, user } = useAuth();

	const navigate = useNavigate();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState("");
	const [answers, setAnswers] = useState<string[]>([]);
	const [showReviewPage, setShowReviewPage] = useState(false);

	// theme selection
	const [theme, setTheme] = useState<number | null>(null);

	const [resultReason, setResultReason] = useState("");
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
				// 마지막 질문이면 답변 확인 페이지로 이동
				setShowReviewPage(true);
			} else {
				// 다음 질문으로 이동
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setAnswer(""); // 답변 초기화
			}
		}
	};

	const handleStartAnalysis = async () => {
		const query: QA[] = QUESTIONS.map((q, idx) => ({
			question: q.question,
			answer: answers[idx],
		}));
		const { themeMeta, reason } = await analyzeTheme(query);
		setResultReason(reason);
		setTheme(themeMeta.id);
	};

	const handleSave = async () => {
		await saveTheme(theme.toString());
		await fetchUser();
		navigate("/home");
	};

	// 결과 페이지
	if (theme) {
		return (
			<main className={styles.resultContainer}>
				<button type="button" className={styles.finishBtn} onClick={handleSave}>
					선택 완료
				</button>

				{/* Content Wrapper */}
				<div className={styles.resultContentWrapper}>
					{/* Description Section */}
					<div className={styles.resultDescription}>
						<p>{resultReason}</p>
					</div>

					{/* Generated Image Section */}
					<div className={styles.resultImageContainer}>
						<img
							src={`/images/theme${theme}.png`}
							alt="Generated Theme"
							className={styles.resultImage}
						/>
					</div>
				</div>

				{/* 다른 테마도 선택 */}
				<div className={styles.themeListWrapper}>
					<span className={styles.smallText}>
						다른 테마도 선택할 수 있어요!
					</span>

					<div className={styles.themeList}>
						{[1, 2, 3, 4, 5].map((i) => (
							<button
								type="button"
								key={i}
								className={
									theme === i
										? `${styles.themeListCard} ${styles.activeCard}`
										: styles.themeListCard
								}
								onClick={() => setTheme(i)}
							>
								<img
									className={styles.themeOptionImg}
									alt={`preview for the ${THEMES[i - 1]} theme option.`}
									src={`/images/theme${i}.png`}
								/>
							</button>
						))}
					</div>
				</div>
			</main>
		);
	}

	// 답변 확인 페이지
	if (showReviewPage && !analysisLoading) {
		return (
			<main className={styles.reviewContainer}>
				<div className={styles.reviewBlob} />
				<div className={styles.reviewContentWrapper}>
					<h2 className={styles.reviewTitle}>
						아래 답변을 기반으로 테마를 선정할게요!
					</h2>

					<div className={styles.reviewStoryBox}>
						<h3 className={styles.reviewStoryTitle}>
							{user?.name || "당신"} 님의 이야기
						</h3>
						<div className={styles.reviewList}>
							{QUESTIONS.map((question, index) => (
								<div key={question.question} className={styles.reviewItem}>
									<span className={styles.reviewLabel}>
										{question.label || question.question}
									</span>
									<p className={styles.reviewAnswer}>{answers[index]}</p>
								</div>
							))}
						</div>
					</div>

					<button
						type="button"
						className={styles.reviewButton}
						onClick={handleStartAnalysis}
					>
						&gt;
					</button>
				</div>
			</main>
		);
	}

	// 분석 중 화면
	if (analysisLoading) {
		return (
			<main className={styles.analyzingContainer}>
				<div className={styles.analyzingWrapper}>
					<img
						src={themeSvg}
						alt="loading page for analyzing theme"
						className={styles.analyzingImage}
					/>
					<h1 style={{ position: "relative", top: "20%", zIndex: 10 }}>
						답변을 분석하는 중이예요.
					</h1>
				</div>
			</main>
		);
	}
	// 저장 중 화면
	if (themeLoading) {
		return (
			<main className={styles.analyzingContainer}>
				<div className={styles.analyzingWrapper}>
					<img
						src={themeSvg}
						alt="loading page for analyzing theme"
						className={styles.analyzingImage}
					/>
					<h1 style={{ position: "relative", top: "20%", zIndex: 10 }}>
						테마를 저장하고 추모관으로 이동하고 있어요!
					</h1>
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
					<span className={styles.exampleTitle}>답변 예시</span>

					<button
						type="button"
						onClick={(e) => setAnswer(e.currentTarget.textContent)}
						className={styles.exampleText}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleNext();
							}
						}}
					>
						{currentQuestion.example1}
					</button>
					<button
						type="button"
						onClick={(e) => setAnswer(e.currentTarget.textContent)}
						className={styles.exampleText}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								handleNext();
							}
						}}
					>
						{currentQuestion.example2}
					</button>
				</div>

				{/* Tip Section */}
				{currentQuestion.tip && (
					<div className={styles.tipSection}>
						<span className={styles.tipText}>
							Tip: {currentQuestion.tip.replace("{name}", user?.name || "당신")}
						</span>
					</div>
				)}

				{/* Answer Input */}
				<textarea
					ref={textareaRef}
					placeholder="답변을 입력해주세요!"
					className={styles.answerInput}
					value={answer}
					onChange={handleAnswerChange}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							handleNext();
						}
					}}
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
