import { useEffect, useState } from "react";
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
	const [tabInventory, setTabInventory] = useState<
		/*"Furniture" |*/ "Floor" | "Wall"
	>("Floor");
	const [tabMyitem, setTabMyItem] = useState<"NOW" | "Generated">("NOW");
	const {
		inventoryObjects,
		sceneObjects,
		generatedObjects,
		userObjects,
		isLoading,
	} = useObjects();
	const propObjects = inventoryObjects.filter((obj) => obj.ontype === "Floor");
	const wallObjects = inventoryObjects.filter(
		(obj) => obj.ontype === "LeftWall" || obj.ontype === "RightWall",
	);
	// furniture?

	// for mapping to item cards (BaseObject type)
	const [renderBaseObject, setRenderBaseObject] = useState<BaseObject[]>(
		activeTab === "Inventory"
			? tabInventory === "Floor"
				? propObjects
				: wallObjects
			: generatedObjects,
	);
	// renderSceneObject : use only sceneObjects

	return (
		activeTab && (
			<div className={styles.main}>
				<div className={styles.titleRow}>
					<h1 className={styles.titleText}>인벤토리</h1>
					<img
						src="../../public/images/button-minimize-ui.svg"
						alt="sidebar minimize button"
						onKeyUp={() => setActiveTab(null)}
					/>
				</div>
				<div>
					<ul className={styles.tabChip}>
						<li
							className={styles.tabChips}
							onKeyUp={() => {
								if (activeTab === "Inventory") {
									setTabInventory("Floor");
								} else {
									setTabMyItem("NOW");
								}
							}}
						>
							{activeTab === "Inventory" ? "바닥" : "NOW"}
						</li>
						<li
							className={styles.tabChips}
							onKeyUp={() => {
								if (activeTab === "Inventory") {
									setTabInventory("Wall");
								} else {
									setTabMyItem("Generated");
								}
							}}
						>
							{activeTab === "Inventory" ? "벽걸이" : "생성"}
						</li>
					</ul>
					<ul className={styles.explanationList}>
						<ol
							className={styles.explanationBullet}
							style={activeTab === "Inventory" ? {} : { visibility: "hidden" }}
						>
							아래 아이템을 끌어 추모관에 배치해보세요.
						</ol>
						<ol className={styles.explanationBullet}>
							{activeTab === "Inventory"
								? "아이템을 클릭하면 변경 가능한 색상을 확인할 수 있어요."
								: tabMyitem === "NOW"
									? "배치된 아이템을 모아볼 수 있어요."
									: "내가 생성했던 아이템을 모두 모아볼 수 있어요."}
						</ol>
					</ul>
				</div>
				<div className={styles.itemGrid}>
					{/* only case tabMyitems === "NOW" is SceneOBject, rest render BaseObject */}
					{activeTab === "MyItem" && tabMyitem === "NOW"
						? sceneObjects.map((r) => ())
                        : renderBaseObject.map((r) => <InventoryItem key={r.id} item={r} />)
					}
				</div>
			</div>
		)
	);
};
