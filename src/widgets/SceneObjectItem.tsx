import { useDrag } from "react-dnd";
import type { DragSourceHookSpec, DragSourceMonitor } from "react-dnd";
import type { SceneObject } from "../shared/types";

const SceneObjectItem = ({
	obj,
	onClick,
}: { obj: SceneObject; onClick: (obj: SceneObject) => void }) => {
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

	return dragRef(
		<button
			type="button"
			tabIndex={0}
			onClick={() => onClick(obj)} // Handle click to edit
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick(obj);
				}
			}}
			style={{
				position: "absolute",
				left: `${obj.coordinate[0] * 100}%`,
				top: `${obj.coordinate[1] * 100}%`,
				opacity: isDragging ? 0.4 : 1,
				cursor: "pointer",
			}}
		>
			<img src={obj.imgSrc} alt={obj.name} />
		</button>,
	);
};
export default SceneObjectItem;
