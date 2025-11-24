import { type ConnectDragSource, useDrag } from "react-dnd";
import type { BaseObject } from "../shared/types";

export const InventoryItem = ({ item }: { item: BaseObject }) => {
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
			<img src={item.imgSrc} alt={item.name} />
			<span>{item.name}</span>
		</div>
	);
};
