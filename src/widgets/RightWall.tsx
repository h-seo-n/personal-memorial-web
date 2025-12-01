import type { PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { DropHandler } from "../shared/types";
import styles from "../styles/Scene.module.css";
import DropSurface from "./DropSurface/DropSurface";

const RightWall = (props: PropsWithChildren<DropHandler>) => {
	const { user } = useAuth();

	return (
		<DropSurface
			{...props}
			surfaceType="RightWall"
			className={styles.rightWall}
		>
			<div
				className={styles.wallInner}
				style={user ? { backgroundColor: `${user.theme.rightWallColor}` } : {}}
			>
				{props.children}
			</div>
		</DropSurface>
	);
};
export default RightWall;
