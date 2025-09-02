"use client";
import React from 'react';

interface ZoomControlsProps {
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onZoomToFit: () => void;
}

const ZoomControls: React.FC<ZoomControlsProps> = ({
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onZoomToFit
}) => {
    return (
        <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-2">
            <div className="flex gap-2">
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onZoomIn}
                    title="Zoom In (Ctrl +)"
                >
                    +
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onZoomOut}
                    title="Zoom Out (Ctrl -)"
                >
                    -
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onResetZoom}
                    title="Reset Zoom (Ctrl 0)"
                >
                    100%
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded"
                    onClick={onZoomToFit}
                    title="Fit to Screen (Ctrl 1)"
                >
                    Fit
                </button>
            </div>
        </div>
    );
};

export default ZoomControls;
