import { useState } from "react";
import { useDrag } from "react-dnd";
import type { DragSourceHookSpec, DragSourceMonitor } from "react-dnd";
import type { SceneObject } from "../shared/types";

const SceneObjectItem = ({
	obj,
	onClickEdit,
}: { obj: SceneObject; onClickEdit: (obj: SceneObject) => void }) => {
	const [{ isDragging }, dragRef] = useDrag<
		SceneObject,
		void,
		{ isDragging: boolean }
	>(() => ({
		type: "SCENE_OBJECT",
		item: obj,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

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
		// <button
		// 	type="button"
		// 	tabIndex={0}
		// 	onClick={() => onClickEdit(obj)} // Handle click to edit
		// 	style={{
		// 		background: "none",
		// 		borderWidth: 0,
		// 		padding: 0,
		// 		margin: 0,
		// 		position: "absolute",
		// 		left: `${obj.coordinate.x * 100}%`,
		// 		top: `${obj.coordinate.y * 100}%`,

		// 		transformOrigin:
		// 			obj.ontype === "Floor" ? "bottom center" : "center center",
		// 		transform: getTransformStyle(),

		// 		opacity: isDragging ? 0.4 : 1,
		// 		cursor: "pointer",
		// 		transformStyle: "preserve-3d",
		// 		pointerEvents: "auto",
		// 		width: "fit-content",
		// 		height: "fit-content",
		// 	}}
		// >
		<img
			src={obj.currentImageSet.src}
			alt={obj.name}
			onClick={() => onClickEdit(obj)} // Handle click to edit
			onKeyDown={(e) => {
				e.preventDefault();
				if (e.key === "Enter") onClickEdit(obj);
			}}
			onLoad={(e) => {
				const naturalWidth = e.currentTarget.naturalWidth;
				const naturalHeight = e.currentTarget.naturalHeight;
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
				transform: getTransformStyle(),

				opacity: isDragging ? 0.4 : 1,
				cursor: "pointer",
				transformStyle: "preserve-3d",
				pointerEvents: "auto",
			}}
		/>,
		// </button>
	);
};
export default SceneObjectItem;
