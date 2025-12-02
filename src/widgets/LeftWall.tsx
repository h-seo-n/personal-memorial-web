import type { PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { DropHandler } from "../shared/types";
import styles from "../styles/Scene.module.css";
import DropSurface from "./DropSurface/DropSurface";

const LeftWall = (props: PropsWithChildren<DropHandler>) => {
	const { user } = useAuth();

	return (
		<DropSurface {...props} surfaceType="LeftWall" className={styles.leftWall}>
			<div
				className={styles.leftWallInner}
				style={user ? { backgroundColor: `${user.theme.leftWallColor}` } : {}}
			>
				{props.children}
			</div>
		</DropSurface>
	);
};
export default LeftWall;
