import { useState } from "react";
import Scene from "../widgets/Scene";

import { DndProvider } from "react-dnd"; // Import DndProvider
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPenToSquare, FaRegEye, FaRegFloppyDisk } from "react-icons/fa6";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/Home.module.css";

const Home = () => {
	// TODO: Theme 불러오기 필요
	const [mode, setMode] = useState<"Edit" | "View">("View");

	// all objects in the room
	const [sceneObjects, setSceneObjects] = useState<SceneObject[]>([]);

	// which sidebar tab is open
	const [activeTab, setActiveTab] = useState("viewMyItems");

	// if editingObject is not in sceneObjects -> it's a new one;
	// but if it is in sceneObjects -> it's configuring an old object
	const [editingObject, setEditingObject] = useState<SceneObject | null>(null);

	/**
	 * when new item is drag & dropped from inventory -> scene
	 * @param item : a dropped item
	 * @param coordinates : dragged position
	 */
	const dropNewObject = (item: BaseObject, coordinates: [number, number]) => {
		const newObject: SceneObject = {
			...item,
			coordinate: coordinates,
			color: item.imageSets[0]?.color ?? "#ffffff",
			itemFunction: null,
			isReversed: false,
		};
		setEditingObject(newObject);
	};

	/**
	 * handler for moving new object
	 * @param id : item's id
	 * @param newCoordinates : newly dropped position
	 * TODO : 움직였을 때 서버에도 좌표 데이터 저장하기
	 */
	const moveObject = (id: string, newCoordinates: [number, number]) => {
		setSceneObjects((prevObjects) =>
			prevObjects.map((obj) =>
				obj.id === id ? { ...obj, coordinate: newCoordinates } : obj,
			),
		);
	};

	/**
	 * when an existing item is clicked -> open modal
	 */
	const clickObject = (object: SceneObject) => {
		if (mode === "Edit") {
			setEditingObject(object);
		}
	};

	/**
	 * when object 설정 완료 in modal
	 */
	const saveModal = (updatedObject: SceneObject) => {
		// Check if this object is already in the scene
		const exists = sceneObjects.some((obj) => obj.id === updatedObject.id);
		// if exists -> update
		if (exists) {
			setSceneObjects((prev) =>
				prev.map((obj) => (obj.id === updatedObject.id ? updatedObject : obj)),
			);
		} else {
			// if not exist -> place a new object
			setSceneObjects((prev) => [...prev, updatedObject]);
		}
		setEditingObject(null);
	};

	return (
		// wrap the app in DnDProvider to enable drag & drop
		<DndProvider backend={HTML5Backend}>
			<main>
				{/* bar with all the buttons */}
				<div className="row nowrap">
					<div className="row">
						<button
							type="button"
							className={
								mode === "Edit"
									? `${styles.active} ${styles.btn}`
									: `${styles.btn}`
							}
						>
							<FaPenToSquare />
							<span>편집 모드</span>
						</button>
						<button
							type="button"
							className={
								mode === "Edit"
									? `${styles.active} ${styles.btn}`
									: `${styles.btn}`
							}
						>
							<FaRegEye />
							<span>관람 모드</span>
						</button>
					</div>
					<button type="button" className={styles.btn}>
						<FaRegFloppyDisk />
						<span>편집 종료</span>
					</button>
				</div>
				<div className={styles.mainLayout}>
					<div className={styles.inventoryColumn}>
						{/* sidebar : shown only in edit mode */}
						{/* {mode === 'Edit' && (
              <Inventory
                activeTab={activeInventoryTab}
                onTabChange={setActiveInventoryTab}
              />
            )} */}
					</div>
					<div className={styles.sceneColumn}>
						<Scene
							objects={sceneObjects}
							onDropNew={dropNewObject}
							onMove={moveObject}
							onClickObject={clickObject}
						/>
					</div>
					<div className={styles.inventoryColumn} />
				</div>
				{/* modal for objects - renders when editingObject is present */}
				{/* {editingObject && (
          <ConfigModal
            object={editingObject}
            onSave={handleSaveModal}
            onClose={() => setEditingObject(null)}
          />
        )} */}
			</main>
		</DndProvider>
	);
};
export default Home;
