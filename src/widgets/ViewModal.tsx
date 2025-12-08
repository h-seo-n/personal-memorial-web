import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ImageSet } from "../shared/types";
import type { SceneObject } from "../shared/types";
import styles from "../styles/ConfigModal.module.css";

interface ViewModalProps {
	object: SceneObject;
	onClose: () => void;
	setBoard: () => void;
}

export const ViewModal = ({ object, onClose, setBoard }: ViewModalProps) => {
	const [color, setColor] = useState(object.currentImageSet.name);

	return (
		<div className={styles.modalWrapper}>
			<button type="button" className={styles.closeButton} onClick={onClose}>
				<img src="/images/x-button.svg" alt="close button" />
			</button>
			<h2 className={styles.title}>{object.name}</h2>
			<div className={styles.imgWrapper}>
				<img
					style={{
						transform: object.isReversed ? "scaleX(-1)" : "scaleX(1)",
						transition: "transform 0.3s ease-in-out",
						maxWidth: "100%",
						borderRadius: "8px",
					}}
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
			{object.itemFunction && object.additionalData && (
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
					onClick={() => {
						if (object.itemFunction === "Link")
							window.open((object.additionalData as { link: string }).link);
						else setBoard();
					}}
				>
					더 많은 이야기
				</button>
			)}
		</div>
	);
};
