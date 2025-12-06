import { useState } from "react";
import { useObjects } from "../contexts/ObjectsContext";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/Sidebar.module.css";
import { InventoryItem } from "./InventoryItem";

type ActiveTab = "Inventory" | "MyItem" | null;
interface SidebarProp {
	activeTab: ActiveTab;
	setActiveTab: (value: ActiveTab) => void;
	onClickPreview: (obj: SceneObject | BaseObject) => void;
}

export const Sidebar = ({
	activeTab,
	setActiveTab,
	onClickPreview,
}: SidebarProp) => {
	const [tabInventory, setTabInventory] = useState<
		/*"Furniture" |*/ "Floor" | "Wall"
	>("Floor");
	const [tabMyitem, setTabMyItem] = useState<"NOW" | "Generated">("NOW");
	const { inventoryObjects, sceneObjects, generatedObjects, isLoading } =
		useObjects();
	const propObjects = inventoryObjects.filter((obj) => obj.ontype === "Floor");
	const wallObjects = inventoryObjects.filter(
		(obj) => obj.ontype === "LeftWall" || obj.ontype === "RightWall",
	);

	// for mapping to item cards
	const renderObject: (BaseObject | SceneObject)[] =
		activeTab === "Inventory"
			? tabInventory === "Floor"
				? propObjects
				: wallObjects
			: tabMyitem === "Generated"
				? generatedObjects
				: sceneObjects;

	return (
		activeTab && (
			<div className={styles.main}>
				<div className={styles.titleRow}>
					<h1 className={styles.titleText}>
						{activeTab === "Inventory" ? "인벤토리" : "내 아이템"}
					</h1>
					<button
						type="button"
						className={styles.closeBtn}
						onClick={() => setActiveTab(null)}
					>
						<img
							src="/images/button-minimize-ui.svg"
							alt="sidebar minimize button"
						/>
					</button>
				</div>
				<div>
					<ul className={styles.tabChip}>
						<button
							type="button"
							className={
								(activeTab === "Inventory" && tabInventory === "Floor") ||
								(activeTab === "MyItem" && tabMyitem === "NOW")
									? `${styles.tabChips} ${styles.activeTab}`
									: styles.tabChips
							}
							onClick={() => {
								if (activeTab === "Inventory") {
									setTabInventory("Floor");
								} else {
									setTabMyItem("NOW");
								}
							}}
						>
							{activeTab === "Inventory" ? "바닥" : "NOW"}
						</button>
						<button
							type="button"
							className={
								(activeTab === "Inventory" && tabInventory === "Wall") ||
								(activeTab === "MyItem" && tabMyitem === "Generated")
									? `${styles.tabChips} ${styles.activeTab}`
									: styles.tabChips
							}
							onClick={() => {
								if (activeTab === "Inventory") {
									setTabInventory("Wall");
								} else {
									setTabMyItem("Generated");
								}
							}}
						>
							{activeTab === "Inventory" ? "벽걸이" : "생성"}
						</button>
					</ul>
				</div>
				<div className={styles.explanationGrid}>
					<ul className={styles.explanationList}>
						<li
							className={styles.explanationBullet}
							style={activeTab === "Inventory" ? {} : { display: "none" }}
						>
							아래 아이템을 끌어 추모관에 배치해보세요.
						</li>
						<li className={styles.explanationBullet}>
							{activeTab === "Inventory"
								? "아이템을 배치한 후 색상 수정 / 좌우 반전이 가능해요."
								: tabMyitem === "NOW"
									? "배치된 아이템을 모아볼 수 있어요."
									: "내가 생성했던 아이템을 모두 모아볼 수 있어요."}
						</li>
					</ul>
				</div>
				<div className={styles.itemGrid}>
					{activeTab === "MyItem" && tabMyitem === "NOW"
						? sceneObjects.map((r: SceneObject) => (
								<button
									key={r.id}
									type="button"
									className={styles.previewItemCard}
									onClick={() => onClickPreview(r)}
								>
									<img src={r.currentImageSet.src} alt={r.description} />
								</button>
							))
						: renderObject.map((r: BaseObject) =>
								activeTab === "MyItem" && tabMyitem === "NOW" ? null : (
									<InventoryItem
										key={r.id}
										item={r}
										onClickPreview={() => onClickPreview(r)}
									/>
								),
							)}
				</div>
			</div>
		)
	);
};
