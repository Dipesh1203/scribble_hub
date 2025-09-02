import { useState, useRef, useCallback } from "react";

interface UseCanvasStateProps {
  scale?: number;
  minScale?: number;
  maxScale?: number;
  scaleBy?: number;
}

export const useCanvasState = ({
  scale = 1,
  minScale = 0.1,
  maxScale = 5,
  scaleBy = 1.1,
}: UseCanvasStateProps = {}) => {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(scale);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseDown = useCallback(
    (e: any) => {
      if (e.target === e.target.getStage()) {
        isDragging.current = true;
        dragStart.current = {
          x: e.evt.clientX - stagePos.x,
          y: e.evt.clientY - stagePos.y,
        };
      }
    },
    [stagePos]
  );

  const handleMouseMove = useCallback((e: any) => {
    if (isDragging.current) {
      const newPos = {
        x: e.evt.clientX - dragStart.current.x,
        y: e.evt.clientY - dragStart.current.y,
      };
      setStagePos(newPos);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const zoomIn = useCallback(() => {
    setIsAnimating(true);
    const newScale = Math.min(stageScale * scaleBy, maxScale);
    setStageScale(newScale);
    setTimeout(() => setIsAnimating(false), 200);
  }, [stageScale, maxScale, scaleBy]);

  const zoomOut = useCallback(() => {
    setIsAnimating(true);
    const newScale = Math.max(stageScale / scaleBy, minScale);
    setStageScale(newScale);
    setTimeout(() => setIsAnimating(false), 200);
  }, [stageScale, minScale, scaleBy]);

  const resetZoom = useCallback(() => {
    setIsAnimating(true);
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
    setTimeout(() => setIsAnimating(false), 200);
  }, []);

  const zoomToFitAll = useCallback(
    (stageRef: any) => {
      if (!stageRef.current) return;

      setIsAnimating(true);
      const stage = stageRef.current;
      const stageWidth = stage.width();
      const stageHeight = stage.height();

      const layer = stage.findOne("Layer");
      const layerRect = layer.getClientRect();

      if (layerRect.width === 0 || layerRect.height === 0) {
        resetZoom();
        return;
      }

      const scaleX = stageWidth / layerRect.width;
      const scaleY = stageHeight / layerRect.height;
      const scale = Math.min(scaleX, scaleY) * 0.9;

      setStageScale(scale);
      setStagePos({
        x: (stageWidth - layerRect.width * scale) / 2 - layerRect.x * scale,
        y: (stageHeight - layerRect.height * scale) / 2 - layerRect.y * scale,
      });

      setTimeout(() => setIsAnimating(false), 200);
    },
    [resetZoom]
  );

  return {
    stagePos,
    stageScale,
    isAnimating,
    setStagePos,
    setStageScale,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToFitAll,
  };
};

export default useCanvasState;
