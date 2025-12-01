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

	const getTransformStyle = () => {
		const baseTransform = "translate(-10%, -10%)";

		if (obj.ontype === "Floor") {
			return `${baseTransform} rotateZ(-45deg) rotateX(-60deg)`;
		}
		if (obj.ontype === "LeftWall") {
			return `${baseTransform} skewY(26.6deg)`;
		}
		if (obj.ontype === "RightWall") {
			return `${baseTransform} skewY(-26.6deg)`;
		}
		return "translate(-50%, -50%)";
	};

	return dragRef(
		<button
			type="button"
			tabIndex={0}
			onClick={() => onClickEdit(obj)} // Handle click to edit
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClickEdit(obj);
				}
			}}
			style={{
				background: "none",
				borderWidth: 0,
				padding: 0,
				margin: 0,

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
		>
			<img
				src={obj.currentImageSet.src}
				alt={obj.name}
				style={{
					display: "block",
					pointerEvents: "none",
				}}
			/>
		</button>,
	);
};
export default SceneObjectItem;
