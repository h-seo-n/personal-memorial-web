import { useState } from "react";
import type { ImageSet } from "../shared/types";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/ViewModal.module.css";

interface ViewModalProps {
	name: string;
	description: string | null;
	currentImageSet: ImageSet;
	imageSets: ImageSet[];
	onClose: () => void;
}

export const ViewModal = ({
	name,
	currentImageSet,
	imageSets,
	description,
	onClose,
}: ViewModalProps) => {
	const [color, setColor] = useState(currentImageSet.name);

	return (
		<div className={styles.modalWrapper}>
			<button type="button" className={styles.closeButton} onClick={onClose}>
				<img src="../../public/images/x-button.svg" alt="close button" />
			</button>
			<h1 className={styles.title}>{name}</h1>
			<div className={styles.imgWrapper}>
				<img
					src={imageSets.find((i) => i.name === color).src}
					alt={description ? description : `${name} with color ${color}`}
				/>
			</div>
			<div className={styles.row}>
				<span className={styles.labelText}>색상</span>
				<ul className={styles.chips}>
					{imageSets.map((imgset) => (
						<li key={`${name}-${imgset.name}`}>
							<button
								type="button"
								id={imgset.name}
								onClick={() => {
									setColor(imgset.name);
								}}
								className={
									color === imgset.name
										? `${styles.colorStateChip} ${styles.active}`
										: `${styles.colorStateChip}`
								}
								style={{ backgroundColor: `${imgset.color}` }}
							/>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
