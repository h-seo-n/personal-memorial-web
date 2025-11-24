import { useState } from "react";
import { FaPen } from "react-icons/fa6";
import type { BaseObject, ItemFunction, SceneObject } from "../shared/types";
import styles from "../styles/ConfigModal.module.css";

// works as both modifying object & creating a new one
// Create : base + coordinates
// Modify : added + coordinates
interface ConfigModalProp {
	base: BaseObject;
	coordinate: [number, number];
	color?: string;
	itemFunction?: ItemFunction;
	isReversed?: boolean;
	additionalData?: string;
}

const ConfigModal = ({
	base,
	coordinate,
	color,
	itemFunction,
	isReversed,
	additionalData,
}: ConfigModalProp) => {
	const [title, setTitle] = useState<string>(base.name);
	const [colorState, setcolorState] = useState<string>(
		color ? color : base.imageSets[0].name,
	);
	const [src, setSrc] = useState<string>(base.imgSrc);
	const [description, setDescription] = useState<string>(
		base.description ? base.description : "",
	);
	const [func, setFunc] = useState<ItemFunction>(null); // 하나만 선택

	// save the new object
	const handleSave = () => {
		const updatedObject = {
			name: title,
			description,
			imageSrc: src,
			itemFunction: func,
			coordinates: { x: coordinate[0], y: coordinate[1] },
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
			</div>
			<button type="button" className={styles.delBtn} onClick={handleSave}>
				편집 종료
			</button>
		</div>
	);
};

export default ConfigModal;
