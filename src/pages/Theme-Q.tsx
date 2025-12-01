import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import theme4Svg from "/images/theme4.svg";
import themeGenSvg from "/images/themeGen.svg";
import apiClient from "../shared/api";
import styles from "../styles/Theme-Q.module.css";

interface Question {
	question: string;
	example1: string;
	example2: string;
	headerText: string;
}

const questions: Question[] = [
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
	const navigate = useNavigate();
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answer, setAnswer] = useState("");
	const [answers, setAnswers] = useState<string[]>([]);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [resultDescription, setResultDescription] = useState("");
	const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
	const [isLoadingResult, setIsLoadingResult] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const currentQuestion = questions[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === questions.length - 1;
	const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
				// 마지막 질문이면 분석 중 화면 표시
				setIsAnalyzing(true);
				
				// API 호출하여 결과 가져오기
				try {
					setIsLoadingResult(true);
					// TODO: 실제 API 엔드포인트로 교체 필요
					// const response = await apiClient.post("/theme/generate", {
					// 	answers: updatedAnswers,
					// });
					// setResultDescription(response.data.description);
					// setResultImageUrl(response.data.imageUrl);
					
					// 임시로 답변 기반 설명 생성
					const description = `당신의 답변을 바탕으로 특별한 공간을 준비했습니다. ${updatedAnswers.join(", ")}`;
					setResultDescription(description);
					setResultImageUrl(null); // 실제 이미지 URL로 교체 필요
					
					// 3초 후 결과 페이지 표시
					setTimeout(() => {
						setIsAnalyzing(false);
						setShowResult(true);
						setIsLoadingResult(false);
					}, 3000);
				} catch (error) {
					console.error("Theme generation error:", error);
					setIsAnalyzing(false);
					setIsLoadingResult(false);
					alert("테마 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
				}
			} else {
				// 다음 질문으로 이동
				setCurrentQuestionIndex(currentQuestionIndex + 1);
				setAnswer(""); // 답변 초기화
			}
		}
	};

	// 답변이 변경되거나 질문이 바뀔 때마다 스크롤을 맨 아래로
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
		}
	}, [answer, currentQuestionIndex]);

	// 결과 페이지가 표시되면 3초 후 자동으로 Home으로 이동
	useEffect(() => {
		if (showResult) {
			const timer = setTimeout(() => {
				navigate("/home");
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [showResult, navigate]);

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
						<p>{resultDescription}</p>
					</div>

					{/* Generated Image Section */}
					<div className={styles.resultImageContainer}>
						{resultImageUrl ? (
							<img
								src={resultImageUrl}
								alt="Generated Theme"
								className={styles.resultImage}
							/>
						) : (
							<div className={styles.resultImagePlaceholder}>
								생성된 이미지가 여기에 표시됩니다
							</div>
						)}
					</div>
				</div>
			</main>
		);
	}

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
					<div className={styles.icon}></div>
					<div className={styles.headerText}>{currentQuestion.headerText}</div>
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

