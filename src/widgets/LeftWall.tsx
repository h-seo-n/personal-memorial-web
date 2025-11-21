import type { PropsWithChildren } from "react";
import type { DropHandler } from "../shared/types";
import styles from "../styles/Scene.module.css";
import DropSurface from "./DropSurface";

const LeftWall = (props: PropsWithChildren<DropHandler>) => {
	return (
		<DropSurface {...props} surfaceType="LeftWall" className={styles.leftWall}>
			<div className={styles.wallInner}>{props.children}</div>
		</DropSurface>
	);
};
export default LeftWall;
