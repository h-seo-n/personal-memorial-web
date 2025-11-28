import { useDrag } from "react-dnd";
import type { BaseObject, SceneObject } from "../shared/types";
/**
 * takes both BaseObject & SceneObject; It only renders their images anyway,
 * and passes the data to Home.tsx when dragged.
 */
export const InventoryItem = ({
	item,
	onClickPreview,
}: {
	item: BaseObject;
	onClickPreview: (obj: SceneObject | BaseObject) => void;
}) => {
	const [{ isDragging }, dragRef] = useDrag<
		BaseObject,
		void,
		{ isDragging: boolean }
	>(() => ({
		type: "INVENTORY_ITEM", // the drag type of InventoryItem
		item: item, // the data
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const dragSourceRef = dragRef as unknown as React.Ref<HTMLButtonElement>;

	return (
		<button
			ref={dragSourceRef}
			type="button"
			onClick={() => onClickPreview(item)}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			<img src={item.currentImageSet.src} alt={item.name} />
		</button>
	);
};
