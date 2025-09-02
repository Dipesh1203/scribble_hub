"use client";
import React, { useRef, useState } from 'react';
import { Stage, Layer } from 'react-konva';
import { useWindowSize } from '@/app/hooks/useWindowSize';

interface MainStageProps {
    children: React.ReactNode;
    stageRef: React.RefObject<any>;
    stagePos: { x: number; y: number };
    stageScale: number;
    onStageChange: (pos: { x: number; y: number }, scale: number) => void;
    onMouseDown: (e: any) => void;
    onMouseMove: (e: any) => void;
    onMouseUp: (e: any) => void;
}

const MainStage: React.FC<MainStageProps> = ({
    children,
    stageRef,
    stagePos,
    stageScale,
    onStageChange,
    onMouseDown,
    onMouseMove,
    onMouseUp
}) => {
    const size = useWindowSize();

    return (
        <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            x={stagePos.x}
            y={stagePos.y}
            scaleX={stageScale}
            scaleY={stageScale}
            style={{ backgroundColor: '#f0f0f0' }}
        >
            <Layer>
                {children}
            </Layer>
        </Stage>
    );
};

export default MainStage;
