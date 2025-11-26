import { useState } from "react";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/Scene.module.css";
import Floor from "./Floor";
import LeftWall from "./LeftWall";
import RightWall from "./RightWall";
import SceneObjectItem from "./SceneObjectItem";

interface SceneProps {
	objects: SceneObject[];
	onDropNew: (item: BaseObject, coordinates: [number, number]) => void;
	onMove: (instanceId: string, newCoordinates: [number, number]) => void;
	onClickEdit: (object: SceneObject) => void;
}

const Scene = ({ objects, onDropNew, onMove, onClickEdit }: SceneProps) => {
	const floorObjects = objects.filter((obj) => obj.ontype === "Floor");
	const leftWallObjects = objects.filter((obj) => obj.ontype === "LeftWall");
	const rightWallObjects = objects.filter((obj) => obj.ontype === "RightWall");

	const dropHandlers = { onDropNew, onMove };

	return (
		<div className={styles.sceneContainer}>
			<div className={styles.room}>
				<LeftWall {...dropHandlers}>
					{leftWallObjects.map((obj) => (
						<SceneObjectItem key={obj.id} obj={obj} onClickEdit={onClickEdit} />
						// key : not a prop passed, but a key used for listing
					))}
				</LeftWall>

				<RightWall {...dropHandlers}>
					{rightWallObjects.map((obj) => (
						<SceneObjectItem key={obj.id} obj={obj} onClickEdit={onClickEdit} />
					))}
				</RightWall>
				<Floor {...dropHandlers}>
					{floorObjects.map((obj) => (
						<SceneObjectItem key={obj.id} obj={obj} onClickEdit={onClickEdit} />
					))}
				</Floor>
			</div>
		</div>
	);
};
export default Scene;
