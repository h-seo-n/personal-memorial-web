import { useState } from "react";
import { useItemGen } from "../contexts/ItemGenContext";
import { useObjects } from "../contexts/ObjectsContext";
import type { BaseObject, SceneObject } from "../shared/types";
import styles from "../styles/Sidebar.module.css";
import { InventoryItem } from "./InventoryItem";

type ActiveTab = "Inventory" | "MyItem" | null;
interface SidebarProp {
	activeTab: ActiveTab;
	setActiveTab: (value: ActiveTab) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProp) => {
	const { ontype } = useItemGen();
	const [detailedTab, setDetailedTab] = useState<"Floor" | "Wall">(
		ontype ? ontype : "Floor",
	);

	const { inventoryObjects, generatedObjects, isLoading } = useObjects();
	const floorInventoryItems = inventoryObjects.filter(
		(obj) => obj.ontype === "Floor",
	);
	const wallInventoryItems = inventoryObjects.filter(
		(obj) => obj.ontype === "LeftWall" || obj.ontype === "RightWall",
	);
	const floorGeneratedItems = generatedObjects.filter(
		(obj) => obj.ontype === "Floor",
	);
	const wallGeneratedItems = generatedObjects.filter(
		(obj) => obj.ontype === "LeftWall" || obj.ontype === "RightWall",
	);

	// for mapping to item cards
	const renderObject: (BaseObject | SceneObject)[] =
		activeTab === "Inventory"
			? detailedTab === "Floor"
				? floorInventoryItems
				: wallInventoryItems
			: detailedTab === "Floor"
				? floorGeneratedItems
				: wallGeneratedItems;

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
								detailedTab === "Floor"
									? `${styles.tabChips} ${styles.activeTab}`
									: styles.tabChips
							}
							onClick={() => {
								setDetailedTab("Floor");
							}}
						>
							바닥
						</button>
						<button
							type="button"
							className={
								detailedTab === "Wall"
									? `${styles.tabChips} ${styles.activeTab}`
									: styles.tabChips
							}
							onClick={() => {
								setDetailedTab("Wall");
							}}
						>
							벽걸이
						</button>
					</ul>
				</div>
				<div className={styles.explanationGrid}>
					<ul className={styles.explanationList}>
						<li style={activeTab === "Inventory" ? {} : { display: "none" }}>
							아래 아이템을 끌어 추모관에 배치해보세요.
						</li>
						<li>
							{activeTab === "Inventory"
								? "아이템을 배치한 후 색상 수정 / 좌우 반전이 가능해요."
								: "내가 생성했던 아이템을 모두 모아볼 수 있어요."}
						</li>
					</ul>
				</div>
				<div className={styles.itemGrid}>
					{renderObject.map((r: BaseObject) => (
						<InventoryItem key={r.id} item={r} />
					))}
				</div>
			</div>
		)
	);
};
