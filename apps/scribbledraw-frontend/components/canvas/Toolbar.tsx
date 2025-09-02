"use client";
import React from 'react';
import { ACTIONS } from '@/app/utils/toolbar';

interface ToolbarProps {
    selectedColor: string;
    selectedStrokeColor: string;
    strokeWidth: number;
    action: string;
    onColorChange: (color: string) => void;
    onStrokeColorChange: (color: string) => void;
    onStrokeWidthChange: (width: number) => void;
    onActionChange: (action: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    selectedColor,
    selectedStrokeColor,
    strokeWidth,
    action,
    onColorChange,
    onStrokeColorChange,
    onStrokeWidthChange,
    onActionChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) => {
    return (
        <div className="fixed top-0 left-0 p-4 bg-white shadow-lg rounded-br-lg">
            <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                    <button
                        className={`tool-btn ${action === ACTIONS.SELECT ? 'active' : ''}`}
                        onClick={() => onActionChange(ACTIONS.SELECT)}
                    >
                        Select
                    </button>
                    <button
                        className={`tool-btn ${action === ACTIONS.RECTANGLE ? 'active' : ''}`}
                        onClick={() => onActionChange(ACTIONS.RECTANGLE)}
                    >
                        Rectangle
                    </button>
                    <button
                        className={`tool-btn ${action === ACTIONS.CIRCLE ? 'active' : ''}`}
                        onClick={() => onActionChange(ACTIONS.CIRCLE)}
                    >
                        Circle
                    </button>
                    <button
                        className={`tool-btn ${action === ACTIONS.DRAW ? 'active' : ''}`}
                        onClick={() => onActionChange(ACTIONS.DRAW)}
                    >
                        Draw
                    </button>
                </div>

                <div className="flex gap-2 items-center">
                    <label>Fill:</label>
                    <input
                        type="color"
                        value={selectedColor}
                        onChange={(e) => onColorChange(e.target.value)}
                    />
                    <label>Stroke:</label>
                    <input
                        type="color"
                        value={selectedStrokeColor}
                        onChange={(e) => onStrokeColorChange(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <label>Width:</label>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={strokeWidth}
                        onChange={(e) => onStrokeWidthChange(Number(e.target.value))}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        className="tool-btn"
                        onClick={onUndo}
                        disabled={!canUndo}
                    >
                        Undo
                    </button>
                    <button
                        className="tool-btn"
                        onClick={onRedo}
                        disabled={!canRedo}
                    >
                        Redo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
