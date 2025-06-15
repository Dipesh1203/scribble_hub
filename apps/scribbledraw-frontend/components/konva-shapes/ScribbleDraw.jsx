import React from "react";
import { Line, Transformer } from "react-konva";

export const ScribbleDraw = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Line
        points={shapeProps.points}
        stroke={shapeProps.stroke || "#000000"}
        strokeWidth={shapeProps.strokeWidth || 3}
        tension={shapeProps.tension || 0.5}
        lineCap={shapeProps.lineCap || "round"}
        lineJoin={shapeProps.lineJoin || "round"}
        x={shapeProps.x || 0}
        y={shapeProps.y || 0}
        opacity={shapeProps.opacity || 1}
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        draggable
        onDragEnd={(e) => {
          const newX = e.target.x();
          const newY = e.target.y();
          shapeRef.current.position({ x: newX, y: newY });
          onChange({
            ...shapeProps,
            x: newX,
            y: newY,
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale back to 1
          node.scaleX(1);
          node.scaleY(1);

          // Transform the points array based on scale
          const transformedPoints = shapeProps.points.map((point, index) => {
            if (index % 2 === 0) {
              // X coordinate
              return point * scaleX;
            } else {
              // Y coordinate
              return point * scaleY;
            }
          });

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            points: transformedPoints,
            strokeWidth: Math.max(
              1,
              shapeProps.strokeWidth * Math.min(scaleX, scaleY)
            ),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          rotateEnabled={true}
          boundBoxFunc={(oldBox, newBox) => {
            // Prevent making scribble too small
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
