// // src/pages/GratitudeDiary.tsx
// import React, { useState, useRef, useEffect } from "react";
// import { FaPencilAlt } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import backToSvg from "/images/back-to.svg";
// import buttonSmallWhite from "/images/button-small-white.svg";
// import styles from "../styles/GratitudeDiary.module.css";

// const GratitudeDiary: React.FC = () => {
// 	const navigate = useNavigate();
// 	const [text, setText] = useState("");
// 	const [title, setTitle] = useState("뒹굴뒹굴 감사일기");
// 	const [isEditingTitle, setIsEditingTitle] = useState(false);
// 	const titleInputRef = useRef<HTMLInputElement>(null);

// 	const [description, setDescription] = useState(
// 		"저는 늘 자기 직전 침대에 누워서, 오늘 하루 감사했던 일을 3가지씩 적고 잤어요!\n여러분의 오늘 하루에는 어떤 감사한 일이 있었나요?",
// 	);
// 	const [isEditingDescription, setIsEditingDescription] = useState(false);
// 	const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
// 	const journalDivRef = useRef<HTMLDivElement>(null);

// 	const [isPopupOpen, setIsPopupOpen] = useState(false);

// 	const handlePencilClick = () => {
// 		setIsEditingTitle(true);
// 	};

// 	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		setTitle(e.target.value);
// 	};

// 	const handleTitleBlur = () => {
// 		if (title.trim() === "") {
// 			setTitle("뒹굴뒹굴 감사일기");
// 		}
// 		setIsEditingTitle(false);
// 	};

// 	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
// 		if (e.key === "Enter") {
// 			handleTitleBlur();
// 		}
// 	};

// 	const handleSmallPencilClick = () => {
// 		setIsEditingDescription(true);
// 	};

// 	const handleDescriptionChange = (
// 		e: React.ChangeEvent<HTMLTextAreaElement>,
// 	) => {
// 		setDescription(e.target.value);
// 	};

// 	const handleDescriptionBlur = () => {
// 		if (description.trim() === "") {
// 			setDescription(
// 				"저는 늘 자기 직전 침대에 누워서, 오늘 하루 감사했던 일을 3가지씩 적고 잤어요!\n여러분의 오늘 하루에는 어떤 감사한 일이 있었나요?",
// 			);
// 		}
// 		setIsEditingDescription(false);
// 	};

// 	// 편집 모드가 활성화되면 input에 포커스
// 	useEffect(() => {
// 		if (isEditingTitle && titleInputRef.current) {
// 			titleInputRef.current.focus();
// 			titleInputRef.current.select();
// 		}
// 	}, [isEditingTitle]);

// 	// 설명 편집 모드가 활성화되면 textarea에 포커스
// 	useEffect(() => {
// 		if (isEditingDescription && descriptionTextareaRef.current) {
// 			descriptionTextareaRef.current.focus();
// 			descriptionTextareaRef.current.select();
// 		}
// 	}, [isEditingDescription]);

// 	return (
// 		<main className={styles.diaryPage}>
// 			{/* Back to Home Button - Top Right */}
// 			<button
// 				type="button"
// 				className={styles.backButton}
// 				onClick={() => navigate("/home")}
// 			>
// 				<img
// 					src={backToSvg}
// 					alt="Back to Home"
// 					className={styles.backButtonImage}
// 				/>
// 			</button>

// 			<div className={styles.inner}>
// 				{/* 상단 제목 영역 */}
// 				<header className={styles.header}>
// 					<div className={styles.titleRow}>
// 						<div className={styles.paperIcon} />
// 						{isEditingTitle ? (
// 							<input
// 								ref={titleInputRef}
// 								type="text"
// 								className={styles.titleInput}
// 								value={title}
// 								onChange={handleTitleChange}
// 								onBlur={handleTitleBlur}
// 								onKeyDown={handleTitleKeyDown}
// 							/>
// 						) : (
// 							<h1 className={styles.titleText}>{title}</h1>
// 						)}
// 						<span
// 							className={styles.pencilIcon}
// 							onClick={handlePencilClick}
// 							style={{ cursor: "pointer" }}
// 						>
// 							<FaPencilAlt />
// 						</span>
// 					</div>
// 					<div className={styles.titleUnderline} />
// 				</header>

// 				{/* 설명 카드 */}
// 				<section className={styles.descriptionSection}>
// 					<div className={styles.descriptionCard}>
// 						{isEditingDescription ? (
// 							<textarea
// 								ref={descriptionTextareaRef}
// 								className={styles.descriptionInput}
// 								value={description}
// 								onChange={handleDescriptionChange}
// 								onBlur={handleDescriptionBlur}
// 							/>
// 						) : (
// 							<p>
// 								{description.split("\n").map((line, index) => (
// 									<React.Fragment key={index}>
// 										{line}
// 										{index < description.split("\n").length - 1 && <br />}
// 									</React.Fragment>
// 								))}
// 							</p>
// 						)}
// 						<span
// 							className={styles.smallPencil}
// 							onClick={handleSmallPencilClick}
// 							style={{ cursor: "pointer" }}
// 						>
// 							<FaPencilAlt />
// 						</span>
// 					</div>
// 				</section>

// 				{/* 큰 작성 영역 */}
// 				<section className={styles.journalSection}>
// 					<div className={styles.journalArea}>
// 						{/* 필요 없으면 textarea 부분은 지워도 됨 */}
// 						<div
// 							ref={journalDivRef}
// 							className={styles.journalTextarea}
// 							contentEditable
// 							suppressContentEditableWarning
// 							onInput={(e) => setText(e.currentTarget.textContent || "")}
// 							data-placeholder="오늘 감사했던 일을 자유롭게 적어보세요 :)"
// 						/>
// 						{/* + 버튼 */}
// 						<button
// 							type="button"
// 							className={styles.addButton}
// 							onClick={() => setIsPopupOpen(true)}
// 						>
// 							<img
// 								src={buttonSmallWhite}
// 								alt="Add"
// 								className={styles.addButtonImage}
// 							/>
// 						</button>
// 					</div>
// 				</section>

// 				{/* 팝업 */}
// 				{isPopupOpen && (
// 					<div
// 						className={styles.popupOverlay}
// 						onClick={() => setIsPopupOpen(false)}
// 					>
// 						<div
// 							className={styles.popupContent}
// 							onClick={(e) => e.stopPropagation()}
// 						>
// 							<button
// 								type="button"
// 								className={styles.closeButton}
// 								onClick={() => setIsPopupOpen(false)}
// 							>
// 								×
// 							</button>
// 							<h2>팝업 제목</h2>
// 							<p>팝업 내용이 여기에 표시됩니다.</p>
// 						</div>
// 					</div>
// 				)}
// 			</div>
// 		</main>
// 	);
// };

// export default GratitudeDiary;
