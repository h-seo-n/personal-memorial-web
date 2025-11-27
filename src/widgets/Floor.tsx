/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { DropHandler } from "../shared/types";
import styles from "../styles/Scene.module.css";
import DropSurface from "./DropSurface";

// Pass through the props from Scene.tsx
const Floor = (props: PropsWithChildren<DropHandler>) => {
	const { user } = useAuth();

	return (
		<DropSurface {...props} surfaceType="Floor" className={styles.floor}>
			<div
				className={styles.floorInner}
				style={{ backgroundColor: `${user.theme.floorColor}` }}
			>
				{props.children}
			</div>
		</DropSurface>
	);
};

export default Floor;
