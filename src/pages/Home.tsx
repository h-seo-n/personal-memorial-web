import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd"; // Import DndProvider
import { HTML5Backend } from "react-dnd-html5-backend";
import { FaPenToSquare, FaRegEye, FaRegFloppyDisk } from "react-icons/fa6";
import apiClient from "../shared/api/index.ts";
import ConfigModal from "../widgets/ConfigModal";
import { LoginPromptModal } from "../widgets/LoginPromptModal.tsx";
import Scene from "../widgets/Scene";
import { Sidebar } from "../widgets/Sidebar";
import { ViewModal } from "../widgets/ViewModal";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useObjects } from "../contexts/ObjectsContext";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/Home.module.css";

const Home = () => {
	// TODO: Theme 수정 기능 필요
	const { user } = useAuth();

	const { sceneObjects, addModified, updateModified } = useObjects();

	const [mode, setMode] = useState<"Edit" | "View">(() => {
		const stored = localStorage.getItem("mode");
		return stored === "Edit" || stored === "View" ? stored : "View";
	});

	useEffect(() => {
		try {
			localStorage.setItem("mode", mode);
		} catch (e) {
			console.error("Failed to access localStorage:", e);
		}
	}, [mode]);

	// which sidebar tab is open
	const [activeTab, setActiveTab] = useState<"Inventory" | "MyItem" | null>(
		null,
	);
	// editingObject ? open ConfigModal : close ConfigModal
	const [editingObject, setEditingObject] = useState<SceneObject | null>(null);
	const [viewObject, setViewObject] = useState<SceneObject | BaseObject | null>(
		null,
	);

	const navigate = useNavigate();

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
	/**
	 *
	 */
	const handleClickPreview = (obj: SceneObject | BaseObject) => {
		setViewObject(obj);
	};

	return (
		// wrap the app in DnDProvider to enable drag & drop
		<DndProvider backend={HTML5Backend}>
			<main>
				{/* bar with all the buttons */}
				<div className={styles.headerRow}>
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
								mode === "View"
									? `${styles.active} ${styles.btn}`
									: `${styles.btn}`
							}
							onClick={() => setMode("View")}
						>
							<FaRegEye />
							<span>관람 모드</span>
						</button>
					</div>
					<button
						type="button"
						id={styles.endBtn}
						className={styles.btn}
						onClick={() => navigate("/end")}
					>
						<FaRegFloppyDisk />
						<span>편집 종료</span>
					</button>
				</div>
				<div className={styles.mainLayout}>
					<div
						className={styles.inventoryColumn}
						style={mode === "View" ? { visibility: "hidden" } : {}}
					>
						<div
							className={styles.promptButton}
							onClick={() => navigate("/item-gen")}
							onKeyUp={(e) => {
								e.preventDefault();
								navigate("/item/gen");
							}}
						>
							<img
								src="/images/Ellipse.svg"
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
					<div
						className={styles.inventoryColumn}
						style={mode === "View" ? { visibility: "hidden" } : {}}
					>
						<button
							type="button"
							className={styles.filledButton}
							onClick={() => {
								setActiveTab("Inventory");
							}}
						>
							<img src="/images/open-box.svg" alt="Inventory tab button" />
						</button>
						<hr />
						<button
							type="button"
							className={styles.filledButton}
							onClick={() => {
								setActiveTab("MyItem");
							}}
						>
							<img src="/images/MY.svg" alt="My item tab button" />
						</button>

						{/* sidebar : shown only in edit mode */}
						{activeTab && (
							<div className={styles.SidebarWrapper}>
								<Sidebar
									activeTab={activeTab}
									setActiveTab={setActiveTab}
									onClickPreview={handleClickPreview}
								/>
							</div>
						)}
					</div>
				</div>
				{/* modal for objects - renders when editingObject is present, and deletingObject is null */}
				{editingObject && (
					<ConfigModal
						base={editingObject}
						onSave={handleSaveModal}
						onClose={handleCloseModal}
					/>
				)}

				{/* modal for viewing objects */}
				{viewObject && (
					<ViewModal
						name={viewObject.name}
						currentImageSet={viewObject.currentImageSet}
						imageSets={viewObject.imageSets}
						description={viewObject.description}
						itemFunction={
							"itemFunction" in viewObject ? viewObject.itemFunction : null
						}
						onClose={() => {
							setViewObject(null);
						}}
					/>
				)}
				{/* modal for prompting login */}
				{!user && <LoginPromptModal />}
			</main>
		</DndProvider>
	);
};
export default Home;
