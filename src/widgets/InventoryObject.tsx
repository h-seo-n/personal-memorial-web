import { useDrag } from 'react-dnd';
import { type InventoryObject } from '../shared/types';

export const InventoryItem = ({ item }: { item: InventoryObject }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'INVENTORY_ITEM',
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    // TODO : put opacity style into stylesheet
    <div ref={dragRef as any} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {item.name}
      <img src={item.imgSrc} alt={item.name} />
      <span>{item.name}</span>
    </div>
  );
};
