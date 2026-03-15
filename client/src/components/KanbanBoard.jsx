import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import DealCard from './DealCard';

export default function KanbanBoard({ deals, stages, onDealMove, onDealClick }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
  );

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const deal = deals.find(d => d.id === active.id);
    const targetStage = over.id;
    if (deal && stages.includes(targetStage) && deal.stage !== targetStage) {
      onDealMove(active.id, targetStage);
    }
  };

  const handleDragCancel = () => setActiveId(null);

  const activeDeal = deals.find(d => d.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 h-full pb-2" style={{ minWidth: 'max-content' }}>
        {stages.map(stage => (
          <KanbanColumn
            key={stage}
            stage={stage}
            deals={deals.filter(d => d.stage === stage)}
            onDealClick={onDealClick}
            isDraggingId={activeId}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{ duration: 150 }}>
        {activeDeal ? (
          <DealCard deal={activeDeal} onClick={() => {}} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
