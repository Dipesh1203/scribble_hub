"use client";
import { useEffect, useRef } from "react";
import { Text, Circle, Layer, Rect, Stage } from "react-konva";

export default function CanvasK({}) {
  const circleRef = useRef(null);
  useEffect(() => {
    console.log(circleRef.current);
  }, []);
  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Text t ext="Try to drag shapes" fontSize={15} />
          <Rect
            x={20}
            y={50}
            width={100}
            height={100}
            fill="red"
            shadowBlur={10}
            draggable
          />
          <Circle
            x={200}
            y={100}
            radius={50}
            fill="green"
            draggable
            onClick={handleClick}
          />
        </Layer>
      </Stage>
    </>
  );
}
