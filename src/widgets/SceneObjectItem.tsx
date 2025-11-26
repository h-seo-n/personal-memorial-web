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
				position: "absolute",
				left: `${obj.coordinate[0] * 100}%`,
				top: `${obj.coordinate[1] * 100}%`,
				opacity: isDragging ? 0.4 : 1,
				cursor: "pointer",
			}}
		>
			<img src={obj.currentImageSet.src} alt={obj.name} />
		</button>,
	);
};
export default SceneObjectItem;
