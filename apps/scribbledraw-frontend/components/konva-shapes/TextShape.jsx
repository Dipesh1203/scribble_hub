import React, { useRef, useEffect, useState, useCallback } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";

const TextEditor = ({ textNode, onClose, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current || !textNode) return;

    const textarea = textareaRef.current;
    const stage = textNode.getStage();
    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stage.container().getBoundingClientRect();

    // Calculate position relative to stage container
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };

    // Match styles with the text node
    textarea.value = textNode.text();
    textarea.style.position = "fixed";
    textarea.style.top = `${areaPosition.y}px`;
    textarea.style.left = `${areaPosition.x}px`;
    textarea.style.width = `${textNode.width() - (textNode.padding() || 0) * 2}px`;
    textarea.style.height = `${textNode.height() - (textNode.padding() || 0) * 2 + 5}px`;
    textarea.style.fontSize = `${textNode.fontSize() || 16}px`;
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "transparent";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight() || 1;
    textarea.style.fontFamily = textNode.fontFamily() || "Arial";
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align() || "left";
    textarea.style.color = textNode.fill() || "black";
    textarea.style.zIndex = "1000";

    const rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += `rotateZ(${rotation}deg)`;
    }
    textarea.style.transform = transform;

    // Auto-resize height
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight + 3}px`;

    textarea.focus();
    textarea.select();

    const handleOutsideClick = (e) => {
      if (e.target !== textarea) {
        onChange(textarea.value);
        onClose();
      }
    };

    const handleKeyDown = (e) => {
      // Prevent event from bubbling to stage
      e.stopPropagation();

      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onChange(textarea.value);
        onClose();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    const handleInput = (e) => {
      e.stopPropagation();
      // Auto-resize height based on content
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 3}px`;
    };

    textarea.addEventListener("keydown", handleKeyDown);
    textarea.addEventListener("input", handleInput);

    // Delay adding click listener to prevent immediate closure
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
    }, 100);

    return () => {
      textarea.removeEventListener("keydown", handleKeyDown);
      textarea.removeEventListener("input", handleInput);
      document.removeEventListener("click", handleOutsideClick);
      clearTimeout(timeoutId);
    };
  }, [textNode, onChange, onClose]);

  return (
    <Html>
      <textarea
        ref={textareaRef}
        style={{
          minHeight: "1em",
          fontFamily: "inherit",
        }}
      />
    </Html>
  );
};

export const TextShape = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isSelected && !isEditing) {
      // Attach transformer when selected but not editing
      trRef.current?.nodes([shapeRef.current]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected, isEditing]);

  const handleTextDblClick = useCallback(() => {
    if (isSelected) {
      setIsEditing(true);
    }
  }, [isSelected]);

  const handleTextChange = useCallback(
    (newText) => {
      onChange({
        ...shapeProps,
        text: newText,
      });
      setIsEditing(false);
    },
    [onChange, shapeProps]
  );

  const handleCloseEditor = useCallback(() => {
    setIsEditing(false);
  }, []);

  return (
    <React.Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        onDblClick={handleTextDblClick}
        onDblTap={handleTextDblClick}
        ref={shapeRef}
        {...shapeProps}
        draggable
        visible={!isEditing}
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

          // Reset scale
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />

      {isEditing && (
        <TextEditor
          textNode={shapeRef.current}
          onChange={handleTextChange}
          onClose={handleCloseEditor}
        />
      )}

      {isSelected && !isEditing && (
        <Transformer
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => ({
            ...newBox,
            width: Math.max(30, newBox.width),
          })}
        />
      )}
    </React.Fragment>
  );
};
