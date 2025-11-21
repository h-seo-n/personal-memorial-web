import type { PropsWithChildren } from "react";
import type { DropHandler } from "../shared/types";
import styles from "../styles/Scene.module.css";
import DropSurface from "./DropSurface";

const RightWall = (props: PropsWithChildren<DropHandler>) => {
	return (
		<DropSurface
			{...props}
			surfaceType="RightWall"
			className={styles.rightWall}
		>
			<div className={styles.wallInner}>{props.children}</div>
		</DropSurface>
	);
};
export default RightWall;
