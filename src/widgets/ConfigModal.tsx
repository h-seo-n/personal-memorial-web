import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import type { BaseObject, ItemFunction, SceneObject } from "../shared/types";
import styles from "../styles/ConfigModal.module.css";

// works as both modifying object & creating a new one
// Create : base + coordinates
// Modify : added + coordinates
interface ConfigModalProp {
	base: SceneObject;
}

const ConfigModal = ({ base }: ConfigModalProp) => {
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

	// save the new object
	const handleSave = () => {
		const updatedObject = {
			name: title,
			description,
			imageSrc: src,
			itemFunction: func,
			coordinates: { x: base.coordinate[0], y: base.coordinate[1] },
			imageSets: base.imageSets,
		};
		// do api func
	};

	return (
		<div className={styles.col}>
			{/* TODO : add close button */}
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
						<li
							key={`${base.name}-${imgset.name}`}
							id={imgset.name}
							onKeyUp={() => {
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
							<li
								key={item}
								className={
									func === item
										? `${styles.chip} ${styles.active}`
										: ` ${styles.chip}`
								}
								onKeyDown={() => {
									func === item
										? setFunc(null) // delete
										: setFunc(item); // add
								}}
							>
								{item}
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
