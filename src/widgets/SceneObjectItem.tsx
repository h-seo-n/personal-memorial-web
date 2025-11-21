import { useDrag } from 'react-dnd';
import { type SceneObject } from '../shared/types';

const SceneObjectItem = ({
  obj,
  onClick,
}: { obj: SceneObject; onClick: (obj: SceneObject) => void }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'SCENE_OBJECT',
    item: obj,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(node) =>
        (dragRef as unknown as (instance: HTMLDivElement | null) => void)(node)
      }
      onClick={() => onClick(obj)} // Handle click to edit
      style={{
        position: 'absolute',
        left: `${obj.data.coordinate[0] * 100}%`,
        top: `${obj.data.coordinate[1] * 100}%`,
        opacity: isDragging ? 0.4 : 1,
        cursor: 'pointer',
      }}
    >
      <img src={obj.base.imgSrc} alt={obj.base.name} />
    </div>
  );
};
export default SceneObjectItem;
