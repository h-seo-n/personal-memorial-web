import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { useObjects } from "../contexts/ObjectsContext";
import type {
	BoardData,
	ItemFunction,
	OnType,
	SceneObject,
} from "../shared/types";
import styles from "../styles/ConfigModal.module.css";

// works as both modifying object & creating a new one
// Create : base + coordinates
// Modify : added + coordinates
interface ConfigModalProp {
	base: SceneObject;
	onSave: (updated: SceneObject) => Promise<void>;
	onClose: () => void;
}

const ConfigModal = ({ base, onSave, onClose }: ConfigModalProp) => {
	const { deleteModified, delLoading } = useObjects();

	const [title, setTitle] = useState<string>(base.name);
	const [colorState, setcolorState] = useState<string>(
		base.currentImageSet.name,
	);
	const [src, setSrc] = useState<string>(base.currentImageSet.src);
	const [description, setDescription] = useState<string>(
		base.description ? base.description : "",
	);
	const [func, setFunc] = useState<ItemFunction>(
		base.itemFunction ? base.itemFunction : null,
	); // 하나만 선택
	const [isReversed, setIsReversed] = useState<boolean>(
		base.isReversed ? base.isReversed : null,
	);
	const [ontype, setOntype] = useState<OnType>(base.ontype);

	const [deleting, setDeleting] = useState<boolean>(false);
	const [additionalDataTitle, setAdditionalDataTitle] = useState<string>(
		base.itemFunction &&
			base.additionalData !== undefined &&
			base.additionalData !== null
			? base.itemFunction === "Link"
				? (base.additionalData as { link: string }).link
				: (base.additionalData as { data: BoardData }).data.title
			: null,
	);

	// save the new object
	const handleSave = () => {
		const additionalData = func
			? func === "Link"
				? { link: additionalDataTitle }
				: // func = board
					base.additionalData
					? // there was already data
						base.itemFunction === "Board"
						? // it was a board data
							{
								data: {
									title: additionalDataTitle,
									description: (base.additionalData as { data: BoardData }).data
										.description,
									items: (
										base.additionalData as {
											data: BoardData;
										}
									).data.items,
								},
							}
						: // it wasn't a board data - make a new data
							{
								data: {
									title: additionalDataTitle,
									description: "",
									items: [],
								},
							}
					: // there wasn't originally data - make a new data also
						{
							data: {
								title: additionalDataTitle,
								description: "",
								items: [],
							},
						}
			: null;

		const updatedObject: SceneObject = {
			id: base.id,
			name: title,
			description,
			currentImageSet: base.imageSets.find((i) => i.name === colorState),
			itemFunction: func,
			coordinate: { x: base.coordinate.x, y: base.coordinate.y },
			imageSets: base.imageSets,
			isReversed: isReversed,
			ontype: ontype,
			isUserMade: base.isUserMade,
		};
		if (additionalData) {
			updatedObject.additionalData = additionalData;
		}

		onSave(updatedObject);
	};

	return (
		<>
			{deleting ? (
				<div className={styles.modalWrapper}>
					<button
						type="button"
						className={styles.closeButton}
						onClick={() => setDeleting(false)}
					>
						<img src="/images/x-button.svg" alt="close button" />
					</button>
					<div style={{ width: "350px", marginTop: "30px" }}>
						<h2 className={styles.titleText}>
							아이템을 정말로 삭제하시겠습니까?
						</h2>
					</div>
					<div className={styles.delRow}>
						<button
							type="button"
							className={styles.delBtn}
							id={styles.delete}
							onClick={async () => {
								await deleteModified(base.id, base.isUserMade);
								setDeleting(false);
								onClose();
							}}
						>
							예
						</button>
						<button
							type="button"
							className={styles.delBtn}
							onClick={() => {
								setDeleting(false);
							}}
						>
							아니오
						</button>
					</div>
				</div>
			) : (
				<div className={styles.modalWrapper}>
					<button
						type="button"
						className={styles.closeButton}
						onClick={onClose}
					>
						<img src="/images/x-button.svg" alt="close button" />
					</button>
					<div className={styles.title}>
						<FaPen />
						<input
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
							}}
							placeholder={"아이템 제목"}
						/>
					</div>
					<div className={styles.imgWrapper}>
						<img
							src={src}
							style={{
								transform: isReversed ? "scaleX(-1)" : "scaleX(1)",
								transition: "transform 0.3s ease-in-out",
								maxWidth: "100%",
								borderRadius: "8px",
							}}
							alt={`an ${base.name} of colorState ${colorState}`}
						/>
						<button
							type="button"
							className={styles.flipButton}
							onClick={() => {
								setIsReversed((prev) => !prev);
								if (ontype === "LeftWall") {
									setOntype("RightWall");
								} else if (ontype === "RightWall") {
									setOntype("LeftWall");
								}
							}}
						>
							{isReversed ? (
								<img
									src="/images/button-flip-horizontal-clicked.svg"
									alt="a horizontal flip button, clicked"
								/>
							) : (
								<img
									src="/images/button-flip-horizontal.svg"
									alt="a horizontal flip button"
								/>
							)}
						</button>
					</div>
					<div className={styles.row}>
						<span className={styles.labelText}>색상</span>
						<ul className={styles.chips}>
							{base.imageSets.map((imgset) => (
								<li key={`${base.name}-${imgset.name}`}>
									<button
										type="button"
										id={imgset.name}
										onClick={() => {
											setcolorState(imgset.name);
											setSrc(imgset.src);
										}}
										className={
											colorState === imgset.name
												? `${styles.colorStateChip} ${styles.active}`
												: `${styles.colorStateChip}`
										}
										style={{ backgroundColor: `${imgset.color}` }}
									/>
								</li>
							))}
						</ul>
					</div>
					<div className={styles.row}>
						<span className={styles.labelText}>추억</span>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="어떤 추억이 깃든 물건인가요?"
						/>
					</div>
					<div className={styles.row}>
						<span className={styles.labelText}>기능</span>
						<div className={styles.col}>
							<ul className={styles.chips}>
								{["Link", "Board"].map((item: ItemFunction) => (
									<li key={item}>
										<button
											type="button"
											className={
												func === item
													? `${styles.chip} ${styles.active}`
													: ` ${styles.chip}`
											}
											onClick={() => {
												func === item
													? setFunc(null) // delete
													: setFunc(item); // add
											}}
										>
											{item === "Link" ? "링크" : "게시판"}
										</button>
									</li>
								))}
							</ul>
							<input
								type="text"
								className={styles.colTextarea}
								style={func ? {} : { display: "none" }}
								value={additionalDataTitle}
								onChange={(e) => setAdditionalDataTitle(e.currentTarget.value)}
								placeholder={
									func === "Link"
										? "연결할 링크 주소를 입력해주세요!"
										: func === "Board"
											? "게시판 제목을 무엇으로 할까요?"
											: "갤러리 제목을 무엇으로 할까요?"
								}
							/>
						</div>
					</div>
					<div className={styles.delRow}>
						<button
							type="button"
							className={styles.delBtn}
							onClick={() => setDeleting(true)}
						>
							삭제하기
						</button>
						<button
							type="button"
							className={styles.delBtn}
							onClick={handleSave}
						>
							편집 종료
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ConfigModal;
