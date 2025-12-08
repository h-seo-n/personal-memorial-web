import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ImageSet } from "../shared/types";
import type { SceneObject } from "../shared/types";
import styles from "../styles/ConfigModal.module.css";

interface ViewModalProps {
	object: SceneObject;
	onClose: () => void;
	itemFunction?: "Gallery" | "Link" | "Board" | null;
	additionalData?: string;
}

export const ViewModal = ({ object, onClose }: ViewModalProps) => {
	const [color, setColor] = useState(object.currentImageSet.name);

	return (
		<div className={styles.modalWrapper}>
			<button type="button" className={styles.closeButton} onClick={onClose}>
				<img src="/images/x-button.svg" alt="close button" />
			</button>
			<h2 className={styles.title}>{object.name}</h2>
			<div className={styles.imgWrapper}>
				<img
					src={object.imageSets.find((i) => i.name === color).src}
					alt={
						object.description
							? object.description
							: `${name} with color ${color}`
					}
				/>
			</div>
			{object.description && (
				<div className={styles.row}>
					<textarea value={object.description} disabled />
				</div>
			)}
			{object.additionalData && (
				<button
					type="button"
					className={`${styles.delBtn}`}
					style={{
						width: "180px",
						padding: "15px 10px",
						alignSelf: "center",
						fontWeight: 500,
						fontSize: "20px",
					}}
				>
					더 많은 이야기
				</button>
			)}
		</div>
	);
};
