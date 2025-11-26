import { useDrag } from "react-dnd";
import type { BaseObject, SceneObject } from "../shared/types";
/**
 * takes both BaseObject & SceneObject; It only renders their images anyway,
 * and passes the data to Home.tsx when dragged.
 */
export const InventoryItem = ({ item }: { item: BaseObject | SceneObject }) => {
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

	const dragSourceRef = dragRef as unknown as React.Ref<HTMLDivElement>;

	return (
		<div ref={dragSourceRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
			{item.name}
			<img src={item.currentImageSet.src} alt={item.name} />
			<span>{item.name}</span>
		</div>
	);
};
