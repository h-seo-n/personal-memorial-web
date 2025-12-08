import React, { useEffect, useRef, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import backToSvg from "/images/back-to.svg";
import buttonSmallWhite from "/images/button-small-white.svg";
import { useObjects } from "../contexts/ObjectsContext";
import apiClient from "../shared/api";
import type { BoardData } from "../shared/types";
import styles from "../styles/Board.module.css";

interface BoardProps {
	data: BoardData;
	id: string;
	closeBoard: () => void;
}

interface Post {
	id: string;
	content: string; // mapped from 'text'
	authorName: string; // mapped from 'writer'
	color: string;
	top: number;
	left: number;
}

export const Board = ({ data, id, closeBoard }: BoardProps) => {
	const { updateBoard } = useObjects();

	const [title, setTitle] = useState(
		data ? data.title : "게시판의 제목을 적어보세요!",
	);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const [description, setDescription] = useState(
		data?.description ||
			"게시판의 설명을 작성해보세요! 이 추모관을 보러올 사람들이 어떤 메시지를 남겼으면 하나요? 예를 들어, 생전 당신의 미담을 자랑해달라고 해도 좋아요!",
	);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
	const contentDivRef = useRef<HTMLDivElement>(null);

	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [postContent, setPostContent] = useState("");
	const [selectedColor, setSelectedColor] = useState("white");
	const [authorName, setAuthorName] = useState("");

	const [posts, setPosts] = useState<Post[]>([]);
	const LAYOUT = {
		WIDTH: 240,
		HEIGHT: 220,
		GAP: 20,
		PADDING: 24,
		CONTAINER_WIDTH: 800,
	};

	const colors = [
		{ name: "white", value: "#ffffff" },
		{ name: "lightgreen", value: "#90EE90" },
		{ name: "lightpink", value: "#FFB6C1" },
		{ name: "lightyellow", value: "#FFFFE0" },
		{ name: "lightgray", value: "#D3D3D3" },
	];

	useEffect(() => {
		if (!data || !data.items) return;
		const postsPerRow = Math.floor(
			(LAYOUT.CONTAINER_WIDTH - LAYOUT.PADDING * 2) /
				(LAYOUT.WIDTH + LAYOUT.GAP),
		);
		const initialPosts = data.items.map((item, index) => {
			// Grid Logic: Calculate Row and Column based on Index
			const row = Math.floor(index / postsPerRow);
			const col = index % postsPerRow;

			// Calculate exact pixel coordinates
			const left = LAYOUT.PADDING + col * (LAYOUT.WIDTH + LAYOUT.GAP);
			const top = LAYOUT.PADDING + row * (LAYOUT.HEIGHT + LAYOUT.GAP);

			return {
				id: `existing-${index}`,
				content: item.text, // Map 'text' to 'content'
				authorName: item.writer, // Map 'writer' to 'authorName'
				color: item.color,
				top: top,
				left: left,
			};
		});
		setPosts(initialPosts);
	}, [data]);

	const handlePencilClick = () => {
		setIsEditingTitle(true);
	};

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);
	};

	const handleTitleBlur = () => {
		if (title.trim() === "") {
			setTitle("유저가 적은 게시판 제목");
		}
		setIsEditingTitle(false);
	};

	const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleTitleBlur();
		}
	};

	const handleSmallPencilClick = () => {
		setIsEditingDescription(true);
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setDescription(e.target.value);
	};

	const handleDescriptionBlur = () => {
		if (description.trim() === "") {
			setDescription(
				"게시판의 설명을 작성해보세요! 이 추모관을 보러올 사람들이 어떤 메시지를 남겼으면 하나요? 예를 들어, 생전 당신의 미담을 자랑해달라고 해도 좋아요!",
			);
		}
		setIsEditingDescription(false);
	};

	const handleClose = async () => {
		await updateBoard(id, {
			title,
			description,
			items: posts.map((p) => ({
				writer: p.authorName,
				text: p.content,
				color: p.color,
			})),
		});

		closeBoard();
	};

	// 편집 모드가 활성화되면 input에 포커스
	useEffect(() => {
		if (isEditingTitle && titleInputRef.current) {
			titleInputRef.current.focus();
			titleInputRef.current.select();
		}
	}, [isEditingTitle]);

	// 설명 편집 모드가 활성화되면 textarea에 포커스
	useEffect(() => {
		if (isEditingDescription && descriptionTextareaRef.current) {
			descriptionTextareaRef.current.focus();
			descriptionTextareaRef.current.select();
		}
	}, [isEditingDescription]);

	return (
		<main className={styles.galleryPage}>
			<button type="button" className={styles.backButton} onClick={handleClose}>
				<img
					src={backToSvg}
					alt="추모관으로"
					className={styles.backButtonImage}
				/>
			</button>

			<div className={styles.inner}>
				<header className={styles.header}>
					<div className={styles.titleRow}>
						{isEditingTitle ? (
							<input
								ref={titleInputRef}
								type="text"
								className={styles.titleInput}
								value={title}
								onChange={handleTitleChange}
								onBlur={handleTitleBlur}
								onKeyDown={handleTitleKeyDown}
							/>
						) : (
							<h1 className={styles.titleText}>{title}</h1>
						)}
						<button
							type="button"
							className={styles.pencilIcon}
							onClick={handlePencilClick}
							style={{ cursor: "pointer" }}
						>
							<FaPencilAlt />
						</button>
					</div>
					<div className={styles.titleUnderline} />
				</header>

				<section className={styles.descriptionSection}>
					<div className={styles.descriptionCard}>
						{isEditingDescription ? (
							<textarea
								ref={descriptionTextareaRef}
								className={styles.descriptionInput}
								value={description}
								onChange={handleDescriptionChange}
								onBlur={handleDescriptionBlur}
							/>
						) : (
							<p className={styles.descriptionText}>
								{description.split("\n").map((line, idx, arr) => (
									<React.Fragment key={`${line}-${line.length}-${idx * 31}`}>
										{line}
										{idx < arr.length - 1 && <br />}
									</React.Fragment>
								))}
							</p>
						)}
						<button
							type="button"
							className={styles.smallPencil}
							onClick={handleSmallPencilClick}
							style={{ cursor: "pointer" }}
						>
							<FaPencilAlt />
						</button>
					</div>
				</section>

				<section className={styles.contentSection}>
					<div ref={contentDivRef} className={styles.contentArea}>
						{posts.map((post) => {
							const colorValue =
								colors.find((c) => c.name === post.color)?.value || "#ffffff";
							return (
								<div
									key={post.id}
									className={styles.postIt}
									style={{
										backgroundColor: colorValue,
										top: `${post.top}px`,
										left: `${post.left}px`,
									}}
								>
									<p className={styles.postItContent}>{post.content}</p>
									<div className={styles.postItFooter}>
										{post.authorName && (
											<p className={styles.postItAuthor}>{post.authorName}</p>
										)}
									</div>
								</div>
							);
						})}
					</div>
					<button
						type="button"
						className={styles.addButton}
						onClick={() => setIsPopupOpen(true)}
					>
						<img
							src={buttonSmallWhite}
							alt="Add"
							className={styles.addButtonImage}
						/>
					</button>
				</section>
			</div>

			{isPopupOpen && (
				<div
					className={styles.popupOverlay}
					onClick={() => setIsPopupOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setIsPopupOpen(false);
						}
					}}
				>
					<div
						className={styles.popupModal}
						onClick={(e) => e.stopPropagation()}
						onKeyDown={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							className={styles.popupCloseButton}
							onClick={() => setIsPopupOpen(false)}
						>
							<img src="/images/x-button.svg" alt="close button" />
						</button>

						<textarea
							className={styles.popupTextArea}
							placeholder="글을 작성해서 등록해보세요!"
							value={postContent}
							onChange={(e) => setPostContent(e.target.value)}
						/>

						<div className={styles.popupRow}>
							<span className={styles.popupLabel}>색상</span>
							<div className={styles.popupDivider} />
							<ul className={styles.popupColorChips}>
								{colors.map((color) => (
									<li key={color.name}>
										<button
											type="button"
											className={`${styles.popupColorChip} ${
												selectedColor === color.name
													? styles.popupColorChipActive
													: ""
											}`}
											style={{ backgroundColor: color.value }}
											onClick={() => setSelectedColor(color.name)}
										/>
									</li>
								))}
							</ul>
						</div>

						<div className={styles.popupRow}>
							<span className={styles.popupLabel}>이름</span>
							<input
								type="text"
								className={styles.popupNameInput}
								placeholder="누가 쓴 글이라고 적을까요?"
								value={authorName}
								onChange={(e) => setAuthorName(e.target.value)}
							/>
						</div>

						<button
							type="button"
							className={styles.popupSubmitButton}
							onClick={() => {
								if (postContent.trim() === "") {
									alert("글 내용을 입력해주세요.");
									return;
								}

								const now = new Date();
								const year = now.getFullYear().toString().slice(-2);
								const month = (now.getMonth() + 1).toString();
								const day = now.getDate().toString();
								const formattedDate = `${year}.${month}.${day}`;

								// 포스트잇 크기와 간격 설정
								const postItWidth = 240;
								const postItHeight = 220;
								const gap = 20;
								const padding = 24; // contentArea의 padding

								// 현재 포스트잇 개수로 위치 계산
								const postsPerRow = Math.floor(
									(800 - padding * 2) / (postItWidth + gap),
								);
								const row = Math.floor(posts.length / postsPerRow);
								const col = posts.length % postsPerRow;

								const left = padding + col * (postItWidth + gap);
								const top = padding + row * (postItHeight + gap);

								const newPost = {
									id: Date.now().toString(),
									content: postContent,
									color: selectedColor,
									authorName: authorName || "익명",
									date: formattedDate,
									rotation: 0,
									top: top,
									left: left,
								};

								setPosts([...posts, newPost]);
								setIsPopupOpen(false);
								setPostContent("");
								setAuthorName("");
								setSelectedColor("white");
							}}
						>
							등록
						</button>
					</div>
				</div>
			)}
		</main>
	);
};

export default Board;
