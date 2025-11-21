import { useState } from "react";
import type { InventoryObject, SceneObject } from "../shared/types";
import styles from "../styles/Scene.module.css";
import Floor from "./Floor";
import LeftWall from "./LeftWall";
import RightWall from "./RightWall";
import SceneObjectItem from "./SceneObjectItem";

interface SceneProps {
	objects: SceneObject[];
	onDropNew: (item: InventoryObject, coordinates: [number, number]) => void;
	onMove: (instanceId: string, newCoordinates: [number, number]) => void;
	onClickObject: (object: SceneObject) => void;
}

const Scene = ({ objects, onDropNew, onMove, onClickObject }: SceneProps) => {
	const floorObjects = objects.filter((obj) => obj.base.ontype === "Floor");
	const leftWallObjects = objects.filter(
		(obj) => obj.base.ontype === "LeftWall",
	);
	const rightWallObjects = objects.filter(
		(obj) => obj.base.ontype === "RightWall",
	);

	const dropHandlers = { onDropNew, onMove };

	return (
		<div className={styles.sceneContainer}>
			<div className={styles.room}>
				<LeftWall {...dropHandlers}>
					{leftWallObjects.map((obj) => (
						<SceneObjectItem key={obj.id} obj={obj} onClick={onClickObject} />
						// key : not a prop passed, but a key used for listing
					))}
				</LeftWall>

				<RightWall {...dropHandlers}>
					{rightWallObjects.map((obj) => (
						<SceneObjectItem key={obj.id} obj={obj} onClick={onClickObject} />
					))}
				</RightWall>
				<Floor {...dropHandlers}>
					{floorObjects.map((obj) => (
						<SceneObjectItem key={obj.id} obj={obj} onClick={onClickObject} />
					))}
				</Floor>
			</div>
		</div>
	);
};
export default Scene;
