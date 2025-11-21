import { type ConnectDragSource, useDrag } from "react-dnd";
import type { InventoryObject } from "../shared/types";

export const InventoryItem = ({ item }: { item: InventoryObject }) => {
	const [{ isDragging }, dragRef] = useDrag<
		InventoryObject,
		void,
		{ isDragging: boolean }
	>(() => ({
		type: "INVENTORY_ITEM",
		item: item,
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	const dragSourceRef = dragRef as unknown as React.Ref<HTMLDivElement>;

	return (
		// TODO : put opacity style into stylesheet
		<div ref={dragSourceRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
			{item.name}
			<img src={item.imgSrc} alt={item.name} />
			<span>{item.name}</span>
		</div>
	);
};
