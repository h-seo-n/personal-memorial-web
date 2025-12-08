import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd"; // Import DndProvider
import { HTML5Backend } from "react-dnd-html5-backend";
import { BiLogOut } from "react-icons/bi";
import { FaPenToSquare, FaRegEye, FaRegFloppyDisk } from "react-icons/fa6";

import { BgmController } from "../widgets/BgmController.tsx";
import ConfigModal from "../widgets/ConfigModal";
import { LoginPromptModal } from "../widgets/LoginPromptModal.tsx";
import Scene from "../widgets/Scene";
import { Sidebar } from "../widgets/Sidebar";
import { ViewModal } from "../widgets/ViewModal";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useItemGen } from "../contexts/ItemGenContext.tsx";
import { useObjects } from "../contexts/ObjectsContext";
import { useTheme } from "../contexts/ThemeContext.tsx";
import type { BaseObject, SceneObject } from "../shared/types";
import type { BoardData } from "../shared/types";
import styles from "../styles/Home.module.css";
import { Board } from "../widgets/Board.tsx";

const Home = () => {
	// TODO: Theme 수정 기능 필요
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const { themes } = useTheme();
	const { sceneObjects, addModified, updateModified } = useObjects();
	const [board, setBoard] = useState<SceneObject | null>(null);

	useEffect(() => {
		if (user && !user.theme) navigate("/theme");
	}, [user, navigate]);

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
	const [viewObject, setViewObject] = useState<SceneObject | null>(null);

	// set a fallback
	useEffect(() => {
		if (!user?.theme) return;
		setWeather(user.theme.weather);
	}, [user]);

	// tooltip
	const { justGenerated, setJustGenerated } = useItemGen();

	// weather
	const [weather, setWeather] = useState("sunny");

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
	 * when an existing item is clicked -> open modal
	 * -> PASS ON to SceneObjectItem as prop, not direct property
	 */
	const handleClick = (object: SceneObject) => {
		if (mode === "Edit") {
			setEditingObject(object);
		} else {
			setViewObject(object);
		}
	};

	/**
	 * when ConfigModal is closed - set editingObject to null
	 */
	const handleCloseConfig = () => {
		setEditingObject(null);
	};

	/**
	 * when viewModal is closed - set viewObject to null
	 */
	const handleCloseView = () => {
		setViewObject(null);
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
			<main className={styles[weather]}>
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
					<div className={styles.inventoryColumn}>
						{mode === "Edit" ? (
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
								<span>아이템 생성</span>
							</div>
						) : (
							<BgmController />
						)}
					</div>

					<div className={styles.sceneColumn}>
						<Scene
							objects={sceneObjects}
							onDropNew={handleDropNewObject}
							onMove={handleMoveObject}
							onClick={handleClick}
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
							<span>인벤토리</span>
						</button>
						<div className={styles.myItemRow}>
							{justGenerated && (
								<img
									className={styles.myToolTip}
									src="images/tooltip-right.svg"
									alt="a tooltip, saying 'new!', pointing to 'My item' sign"
								/>
							)}
							<button
								type="button"
								className={styles.filledButton}
								onClick={() => {
									if (justGenerated) {
										setJustGenerated(false);
									}
									setActiveTab("MyItem");
								}}
							>
								<img src="/images/MY.svg" alt="My item tab button" />
								<span>내 아이템</span>
							</button>
						</div>
						{/* sidebar : shown only in edit mode */}
						{activeTab && (
							<div className={styles.SidebarWrapper}>
								<Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
							</div>
						)}
					</div>
				</div>
				<div className={styles.logoutRow}>
					<button
						type="button"
						className={styles.btn}
						onClick={() => {
							logout();
							navigate("/");
						}}
					>
						<BiLogOut /> <span>로그아웃</span>
					</button>
				</div>
				{/* modal for objects - renders when editingObject is present, and deletingObject is null */}
				{mode === "Edit" && editingObject && (
					<ConfigModal
						base={editingObject}
						onSave={handleSaveModal}
						onClose={handleCloseConfig}
					/>
				)}

				{/* View mode : modal for viewing objects*/}
				{mode === "View" && viewObject && (
					<ViewModal
						object={viewObject}
						onClose={handleCloseView}
						setBoard={() => {
							setBoard(viewObject);
							setViewObject(null);
						}}
					/>
				)}
				{mode === "View" && board && (
					<Board
						data={(board.additionalData as { data: BoardData }).data}
						id={board.id}
						closeBoard={() => setBoard(null)}
					/>
				)}

				{/* modal for prompting login */}
				{!user && <LoginPromptModal />}
			</main>
		</DndProvider>
	);
};
export default Home;
