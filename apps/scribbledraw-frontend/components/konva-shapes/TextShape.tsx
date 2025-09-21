import { useEffect, useRef, useState } from 'react';
import { Text, Transformer } from 'react-konva';

interface TextShapeProps {
    shapeProps: {
        id: string;
        x: number;
        y: number;
        text?: string;
        fontSize?: number;
        fill?: string;
        draggable?: boolean;
    };
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: any) => void;
}

const TextShape = ({ shapeProps, isSelected, onSelect, onChange }: TextShapeProps) => {
    const shapeRef = useRef<any>(null);
    const trRef = useRef<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [text, setText] = useState(shapeProps.text || 'Double click to edit');

    useEffect(() => {
        if (isSelected) {
            // Attach transformer
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const handleDoubleClick = () => {
        setIsEditing(true);
        // Create textarea over the text shape
        const textNode = shapeRef.current;
        const stage = textNode.getStage();

        // Get position relative to the stage
        const textPosition = textNode.absolutePosition();
        const stageBox = stage.container().getBoundingClientRect();
        const scale = stage.scaleX();

        // Calculate position taking into account stage's position and scale
        const areaPosition = {
            x: stageBox.left + textPosition.x * scale,
            y: stageBox.top + textPosition.y * scale
        };

        // Create and style textarea
        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        // Calculate proper dimensions
        const width = Math.max(textNode.width() * scale, 100); // minimum width of 100px
        const height = Math.max(textNode.height() * scale, 20); // minimum height of 20px

        textarea.value = text;
        textarea.style.position = 'absolute';
        textarea.style.top = `${areaPosition.y}px`;
        textarea.style.left = `${areaPosition.x}px`;
        textarea.style.width = `${width}px`;
        textarea.style.height = `${height}px`;
        textarea.style.fontSize = `${(shapeProps.fontSize || 16) * scale}px`;
        textarea.style.border = '1px solid #999';
        textarea.style.padding = '5px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = '#fff';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = '1.2';
        textarea.style.fontFamily = 'Arial';
        textarea.style.borderRadius = '3px';
        textarea.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
        textarea.style.color = shapeProps.fill || 'black';
        textarea.style.zIndex = '1000';

        // Prevent stage events while editing
        // Disable stage events while editing
        stage.container().style.pointerEvents = 'none';
        textarea.style.pointerEvents = 'auto';

        textarea.focus();

        const handleOutsideClick = (e: MouseEvent) => {
            if (e.target !== textarea) {
                completeEditing();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                completeEditing();
            }
            if (e.key === 'Escape') {
                completeEditing(true); // cancel editing
            }
        };

        const completeEditing = (cancelled = false) => {
            const newText = cancelled ? text : textarea.value;
            setIsEditing(false);
            setText(newText);
            if (!cancelled) {
                onChange({
                    ...shapeProps,
                    text: newText,
                });
            }
            cleanup();
        };

        const cleanup = () => {
            document.body.removeChild(textarea);
            window.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('keydown', handleKeyDown);
            // Re-enable stage events
            if (stage?.container()) {
                stage.container().style.pointerEvents = 'auto';
            }
        };

        textarea.addEventListener('blur', () => {
            completeEditing();
        });

        // Small delay to prevent immediate blur
        setTimeout(() => {
            window.addEventListener('click', handleOutsideClick);
            window.addEventListener('keydown', handleKeyDown);
        }, 0);
    };

    return (
        <>
            <Text
                ref={shapeRef}
                {...shapeProps}
                text={text}
                fontSize={shapeProps.fontSize || 16}
                fill={shapeProps.fill || 'black'}
                draggable={shapeProps.draggable !== false}
                onClick={onSelect}
                onTap={onSelect}
                onDblClick={handleDoubleClick}
                onDragEnd={(e) => {
                    onChange({
                        ...shapeProps,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    node.scaleX(1);
                    node.scaleY(1);

                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        fontSize: (shapeProps.fontSize || 16) * scaleX,
                    });
                }}
            />
            {isSelected && <Transformer ref={trRef} />}
        </>
    );
};

export { TextShape };