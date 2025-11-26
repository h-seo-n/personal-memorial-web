import { useState } from "react";
import { DndProvider } from "react-dnd"; // Import DndProvider
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPenToSquare, FaRegEye, FaRegFloppyDisk } from "react-icons/fa6";

import ConfigModal from "../widgets/ConfigModal";
import Scene from "../widgets/Scene";
import { Sidebar } from "../widgets/Sidebar";

import {
	type ApiModifiedCreateRequest,
	type ApiModifiedEditRequest,
	useObjects,
} from "../contexts/ObjectsContext";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/Home.module.css";

const Home = () => {
	// TODO: Theme 불러오기 필요

	const { sceneObjects, addModified, updateModified } = useObjects();

	const [mode, setMode] = useState<"Edit" | "View">("View");
	// which sidebar tab is open
	const [activeTab, setActiveTab] = useState<"Inventory" | "MyItem" | null>(
		null,
	);
	// editingObject ? open ConfigModal : close ConfigModal
	const [editingObject, setEditingObject] = useState<SceneObject | null>(null);

	/**
	 * when new item is drag & dropped from inventory -> scene
	 * @param item : a dropped item
	 * @param coordinate : dragged position
	 */
	const handleDropNewObject = async (
		item: BaseObject,
		[x, y]: [number, number],
	) => {
		// call addModified, and add placeholder object
		const newObject = await addModified({
			...item,
			itemFunction: null,
			isReversed: false,
			coordinate: { x, y },
		});
		setEditingObject(newObject); // open modal
	};

	/**
	 * handler for moving new object
	 * @param id : item's id
	 * @param newCoordinates : newly dropped position
	 * TODO : 움직였을 때 서버에도 좌표 데이터 저장하기
	 */
	const handleMoveObject = async (id: string, [x, y]: [number, number]) => {
		const prev = sceneObjects.find((obj) => obj.id === id);
		if (!prev) return;

		const updated: SceneObject = {
			...prev,
			coordinate: { x, y },
		};

		// updateObject
		await updateModified(id, updated);
	};

	/**
	 * when an existing item's 'edit button' is clicked -> open modal
	 * -> PASS ON to SceneObjectItem as prop, not direct property
	 */
	const handleClickEdit = (object: SceneObject) => {
		if (mode === "Edit") {
			setEditingObject(object);
		}
	};

	/**
	 * when ConfigModal is closed - set editingObject to null
	 */
	const handleCloseModal = () => {
		setEditingObject(null);
	};

	/**
	 * when object 편집 종료 in ConfigModal -
	 * since placeholder obj is already in handleDropNewObject,
	 * only call updateModified with new SceneObject -> 수정 & 새로 만듦 로직 통일 가능!
	 */
	const handleSaveModal = async (updated: SceneObject) => {
		await updateModified(updated.id, updated);
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
							onClick={() => setMode("Edit")}
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
							onClick={() => setMode("View")}
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
						<div className={styles.promptButton}>
							<img
								src="../../public/images/Elipse.svg"
								alt="button to AI generation page"
							/>
						</div>
						<div className={styles.balloon}>
							어떤 아이템을 두어야 할지 고민되시나요?
						</div>
					</div>

					<div className={styles.sceneColumn}>
						<Scene
							objects={sceneObjects}
							onDropNew={handleDropNewObject}
							onMove={handleMoveObject}
							onClickEdit={handleClickEdit}
						/>
					</div>
					<div className={styles.inventoryColumn}>
						<div className={styles.filledButton}>
							<img src="/images/open-box.svg" alt="Inventory tab button" />
						</div>
						<hr />
						<div className={styles.filledButton}>
							<img src="/images/MY.svg" alt="My item tab button" />
						</div>
						{/* sidebar : shown only in edit mode */}
						{mode === "Edit" && activeTab && (
							<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
						)}
					</div>
				</div>
				{/* modal for objects - renders when editingObject is present */}
				{editingObject && (
					<ConfigModal
						base={editingObject}
						onSave={handleSaveModal}
						onClose={handleCloseModal}
					/>
				)}
			</main>
		</DndProvider>
	);
};
export default Home;
