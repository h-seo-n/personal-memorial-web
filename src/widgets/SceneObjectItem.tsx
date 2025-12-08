import { useState } from "react";
import { useDrag } from "react-dnd";
import type { SceneObject } from "../shared/types";

const SceneObjectItem = ({
	obj,
	onClick,
	mode,
}: {
	obj: SceneObject;
	onClick: (obj: SceneObject) => void;
	mode: "View" | "Edit";
}) => {
	const [{ isDragging }, dragRef] = useDrag<
		SceneObject,
		void,
		{ isDragging: boolean }
	>(
		() => ({
			type: "SCENE_OBJECT",
			item: obj,
			canDrag: mode === "Edit",
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[mode, obj],
	);

	const SCALE_RATIO = 0.7;
	const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);

	const getTransformStyle = () => {
		const baseTransform = "translate(-10%, -40%)";

		if (obj.ontype === "Floor") {
			return `${baseTransform} rotateZ(-45deg) rotateX(-55deg)`;
		}
		if (obj.ontype === "LeftWall") {
			return `${baseTransform} skewY(29.8deg)`;
		}
		if (obj.ontype === "RightWall") {
			return `${baseTransform} skewY(-29.8deg)`;
		}
		return "translate(-50%, -50%)";
	};

	return dragRef(
		<img
			src={obj.currentImageSet.src}
			alt={obj.name}
			onClick={() => onClick(obj)} // Handle click to edit
			onKeyDown={(e) => {
				e.preventDefault();
				if (e.key === "Enter") onClick(obj);
			}}
			onLoad={(e) => {
				const naturalWidth = Math.min(e.currentTarget.naturalWidth, 160);
				const naturalHeight = Math.min(e.currentTarget.naturalHeight, 160);
				setImgSize({
					w: naturalWidth * SCALE_RATIO,
					h: naturalHeight * SCALE_RATIO,
				});
			}}
			style={{
				// display: "block",

				width: imgSize ? `${imgSize.w}px` : "auto",
				height: imgSize ? `${imgSize.h}px` : "auto",
				visibility: imgSize ? "visible" : "hidden",

				// button -> img
				position: "absolute",
				left: `${obj.coordinate.x * 100}%`,
				top: `${obj.coordinate.y * 100}%`,

				transformOrigin:
					obj.ontype === "Floor" ? "bottom center" : "center center",
				transform: obj.isReversed
					? `${getTransformStyle()} scaleX(-1) `
					: getTransformStyle(),

				opacity: isDragging ? 0.4 : 1,
				cursor: "pointer",
				transformStyle: "preserve-3d",
				pointerEvents: "auto",
			}}
		/>,
	);
};
export default SceneObjectItem;
