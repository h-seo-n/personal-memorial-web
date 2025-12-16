import { useDragLayer } from "react-dnd";
import type { DragItem } from "../shared/types";

const getItemStyles = (currentOffset: { x: number; y: number } | null) => {
	if (!currentOffset) return { display: "none" as const };

	const { x, y } = currentOffset;
	return {
		position: "fixed" as const,
		pointerEvents: "none" as const,
		left: 0,
		top: 0,
		transform: `translate(${x}px, ${y}px)`,
		WebkitTransform: `translate(${x}px, ${y}px)`,
		zIndex: 9999,
	};
};

const SCALE_RATIO = 0.7;

export default function CustomDragLayer() {
	const { itemType, isDragging, item, currentOffset } = useDragLayer(
		(monitor) => ({
			itemType: monitor.getItemType(),
			isDragging: monitor.isDragging(),
			item: monitor.getItem() as DragItem | null,
			currentOffset: monitor.getClientOffset(), // 커서 좌표
		}),
	);

	if (!isDragging || itemType !== "SCENE_OBJECT" || !item) return null;

	const transform = item.isReversed
		? "translate(-50%, -50%) scaleX(-1)"
		: "translate(-50%, -50%)";

	const w = item.dragPreviewSize?.w;
	const h = item.dragPreviewSize?.h;

	return (
		<div style={getItemStyles(currentOffset)}>
			<img
				src={item.currentImageSet.src}
				alt={item.name}
				draggable={false}
				style={{
					width: w ? `${w}px` : 160 * SCALE_RATIO,
					height: h ? `${h}px` : "auto",
					transformOrigin:
						item.ontype === "Floor" ? "bottom center" : "center center",
					transformStyle: "preserve-3d",
					transform,
				}}
				crossOrigin="anonymous"
			/>
		</div>
	);
}
