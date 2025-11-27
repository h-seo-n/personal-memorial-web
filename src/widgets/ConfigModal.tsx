import { useEffect, useState } from "react";
import { FaPen } from "react-icons/fa6";
import { useObjects } from "../contexts/ObjectsContext";
import type { BaseObject, ItemFunction, SceneObject } from "../shared/types";
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
	const { updateModified } = useObjects();

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

	// save the new object
	const handleSave = () => {
		const updatedObject: SceneObject = {
			id: base.id,
			name: title,
			description,
			currentImageSet: base.imageSets.find((i) => i.name === colorState),
			itemFunction: func,
			coordinate: { x: base.coordinate[0], y: base.coordinate[1] },
			imageSets: base.imageSets,
			isReversed: isReversed,
			ontype: base.ontype,
			isUserMade: base.isUserMade,
		};
		onSave(updatedObject);
	};

	return (
		<div className={styles.col}>
			<button type="button" className={styles.closeButton} onClick={onClose}>
				<img src="../../public/images/x-button.svg" alt="close button" />
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
				<img src={src} alt={`an ${base.name} of colorState ${colorState}`} />
				<button type="button" className={styles.flipButton}>
					<img
						src="../../public/images/button-flip-horizontal.svg"
						alt="a horizontal flip button"
					/>
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
				<span className={styles.labelText}>설명</span>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="어떤 의미가 담긴 물건인가요?"
				/>
			</div>
			<div className={styles.row}>
				<span className={styles.labelText}>기능</span>
				<div className={styles.col}>
					<ul className={styles.chips}>
						{["Link", "Gallery", "Board"].map((item: ItemFunction) => (
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
									{item}
								</button>
							</li>
						))}
					</ul>
					<input
						type="text"
						style={func ? {} : { visibility: "hidden" }}
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

			<button type="button" className={styles.delBtn} onClick={handleSave}>
				편집 종료
			</button>
		</div>
	);
};

export default ConfigModal;
