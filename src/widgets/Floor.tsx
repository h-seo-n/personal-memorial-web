import { type PropsWithChildren } from 'react';
import type { DropHandler } from '../shared/types';
import styles from '../styles/Scene.module.css';
import DropSurface from './DropSurface';

// Pass through the props from Scene.tsx
const Floor = (props: PropsWithChildren<DropHandler>) => {
  return (
    <DropSurface {...props} surfaceType="Floor" className={styles.floor}>
      <div className={styles.floorInner}>{props.children}</div>
    </DropSurface>
  );
};

export default Floor;
