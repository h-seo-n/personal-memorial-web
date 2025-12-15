import { useRef } from "react";
import { useDrop } from "react-dnd";
import type { BaseObject, OnType, SceneObject } from "../../shared/types";
import {
	getIsometricCoordinates,
	getSkewedCoordinates,
	getStandardCoordinates,
} from "./coordinateUtils";

interface DropSurfaceProps {
	onDropNew: (item: BaseObject, coordinates: [number, number]) => void;
	onMove: (instanceId: string, newCoordinates: [number, number]) => void;
	children: React.ReactNode;
	surfaceType: OnType;
	className?: string;
}

const DropSurface = ({
	onDropNew,
	onMove,
	children,
	surfaceType,
	className,
}: DropSurfaceProps) => {
	const ref = useRef<HTMLDivElement>(null); // Ref to surface dic div

	const [{ isOver, canDrop }, dropRef] = useDrop(
		() => ({
			// can drop items from inventory(add) & already in scene(move)
			accept: ["INVENTORY_ITEM", "SCENE_OBJECT"],

			canDrop: (item: BaseObject | SceneObject) => {
				if (item.ontype === "Floor") {
					return surfaceType === "Floor";
				}
				return surfaceType === "LeftWall" || surfaceType === "RightWall";
			},

			drop: (item, monitor) => {
				const dropPosition = monitor.getClientOffset();
				const element = ref.current;
				const surfaceBounds = ref.current?.getBoundingClientRect();

				if (!dropPosition || !surfaceBounds || !element) return;

				let coordinates: [number, number] = [0, 0];

				if (surfaceType === "Floor") {
					coordinates = getIsometricCoordinates(
						dropPosition.x,
						dropPosition.y,
						surfaceBounds,
						element.offsetWidth,
					);
				} else if (surfaceType === "RightWall") {
					coordinates = getSkewedCoordinates(
						dropPosition.x,
						dropPosition.y,
						surfaceBounds,
						29.8,
					);
				} else if (surfaceType === "LeftWall") {
					coordinates = getSkewedCoordinates(
						dropPosition.x,
						dropPosition.y,
						surfaceBounds,
						-29.8,
					);
				}

				const finalCoords: [number, number] = [
					Math.max(0, Math.min(1, coordinates[0])),
					Math.max(0, Math.min(1, coordinates[1])),
				];

				// ------ Handle dropped item -------------------
				const itemType = monitor.getItemType();
				if (itemType === "INVENTORY_ITEM") {
					// new item: call handler - open modal
					onDropNew(item as BaseObject, finalCoords);
				} else {
					onMove((item as SceneObject).id, finalCoords);
				}
			},
			collect: (monitor) => ({
				isOver: monitor.isOver(),
				canDrop: monitor.canDrop(),
			}),
		}),
		[surfaceType, onDropNew, onMove],
	);

	// combine ref(drag source) -> make Scene both a drop target & source
	const combinedRef = (el: HTMLDivElement) => {
		dropRef(el);
		ref.current = el;
	};

	const getDropStyles = () => {
		if (isOver && canDrop) {
			return { backgroundColor: "rgba(0,255,0,0.1)" }; // green hue for available
		}
		if (isOver && !canDrop) {
			return { backgroundColor: "rgba(237, 0, 0, 0.1)" }; // red hue for not available
		}
		return {};
	};

	return (
		<div
			ref={combinedRef}
			className={className}
			style={{
				position: "relative",
				...getDropStyles(),
			}}
		>
			{children}
		</div>
	);
};

export default DropSurface;
