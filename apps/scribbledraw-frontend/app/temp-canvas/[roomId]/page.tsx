"use client";
import { BACKEND_URL, WS_URL } from "@repo/common/server";
import axios from "axios";
import { get } from "http";
import { DefaultSession } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useRef, useState, useEffect, act, use } from "react";
import { Circle, Layer, Rect, Stage, Transformer } from "react-konva";
// import { uuid } from "crypto";
import { uuid } from "uuidv4";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandX,
  IconExchange,
  IconHome,
  IconNewSection,
  IconTerminal2,
} from "@tabler/icons-react";
import FloatingButton from "@/components/ProfileDropdown";
import { ACTIONS } from "@/app/utils/toolbar";
import { on } from "events";
import ProfileDropdown from "@/components/ProfileDropdown";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Rectangle } from "@/components/konva-shapes/Rectangle";
import { CircleShape } from "@/components/konva-shapes/CircleShape";
const strokeColor = "black";
const fillColor = "#fff";
// const isDraggable = true;

export interface Session extends DefaultSession {
  user: {
    id: string;
  } & DefaultSession["user"];
  token?: string;
  iat?: number;
  exp?: number;
}

const Pages = ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = use(params);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const [socket, setSocket] = useState<WebSocket | null>();
  const [shapes, setShapes] = useState<any[]>([]);
  const [rectangles, setRectangles] = useState<any[]>([]);
  const [circles, setCircles] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>("black");
  const [selectedStrokeColor, setSelectedStrokeColor] =
    useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [action, setAction] = useState(ACTIONS.SELECT);
  const { data, status } = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const session = data as Session;
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const SCALE_BY = 1.1;
  const MIN_SCALE = 0.1;
  const MAX_SCALE = 5;
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const isPainting = useRef(false);
  const currentShapeId = useRef<string | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as any).contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) setIsCtrlPressed(true);
    };
    const handleKeyUp = () => setIsCtrlPressed(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(
      `${WS_URL}?token=${(session && session?.token) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiOTY3YWZmNy0yNTY4LTQ5OTUtYjQ1Ny1kNTFiODQwYjlhMWQiLCJpYXQiOjE3NDI0MTA1OTZ9.MCxZ34-iMznxnfZC8c4uSqRM5FmJYMXOYcvuLVaWKcU"}`
    );
    console.log("ws", ws);
    console.log("roomId", roomId);
    // Listen for messages from the server
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat" && data.message?.shape) {
          const shape = data.message.shape;
          if (shape.radius) {
            setCircles((prev) => [...prev, shape]);
          } else if (shape.width && shape.height) {
            setRectangles((prev) => [...prev, shape]);
          }
        }
      } catch (err) {
        console.error("Invalid message from socket:", event.data);
      }
    };
    ws.onopen = () => {
      console.log("connect ws ..............");
      setSocket(ws);
      console.log("connect ws ..............");
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        })
      );
    };
    return () => {
      ws.close();
    };
  }, [roomId, session]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return; // Don't handle keys while animating

      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          zoomIn();
        } else if (e.key === "-") {
          e.preventDefault();
          zoomOut();
        } else if (e.key === "0") {
          e.preventDefault();
          resetZoom();
        } else if (e.key === "1") {
          e.preventDefault();
          zoomToFitAll();
        }
      }

      if (e.ctrlKey) setIsCtrlPressed(true);
    };

    const handleKeyUp = () => setIsCtrlPressed(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stageScale, isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          zoomIn();
        } else if (e.key === "-") {
          e.preventDefault();
          zoomOut();
        } else if (e.key === "0") {
          e.preventDefault();
          resetZoom();
        }
      }

      if (e.ctrlKey) setIsCtrlPressed(true);
    };

    const handleKeyUp = () => setIsCtrlPressed(false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [stageScale]);

  useEffect(() => {
    console.log("socket change");
    if (socket) {
      getExistingShapes(roomId);
    }
  }, [socket]);

  useEffect(() => {
    console.log("ref change");
    setShapes([...rectangles, ...circles]);
  }, [rectangles, circles]);

  const zoomControls = [
    {
      name: "zoom-in",
      icon: (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      ),
      onClick: () => zoomIn(),
    },
    {
      name: "zoom-out",
      icon: (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      ),
      onClick: () => zoomOut(),
    },
    {
      name: "zoom-reset",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <circle cx="11" cy="11" r="3" />
        </svg>
      ),
      onClick: () => resetZoom(),
    },
  ];
  const floatingButtons = [
    {
      name: "cursor",
      icon: (
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M3 3l7 17 2-7 7-2L3 3z" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.SELECT),
    },
    {
      name: "scribble",
      icon: (
        <svg
          className="w-6 h-6 text-pink-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M16 4l4 4L8 20H4v-4L16 4z" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.SCRIBBLE),
    },
    {
      name: "circle",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.CIRCLE),
    },
    {
      name: "rectangle",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-purple-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 5m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.RECTANGLE),
    },
    {
      name: "text",
      icon: (
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M4 4h16M12 4v16" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.TEXT),
    },
    {
      name: "delete",
      icon: (
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M6 7h12M9 7V4h6v3M10 11v6M14 11v6M5 7h14v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.DELETE),
    },
    {
      name: "arrow",
      icon: (
        <svg
          className="w-6 h-6 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      ),
      onClick: () => setAction(ACTIONS.ARROW),
    },
    {
      name: "color",
      icon: (
        <label className="w-6 h-6 block relative cursor-pointer">
          <svg
            className="w-6 h-6 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M12 22c4.418 0 8-4.03 8-9s-3.582-9-8-9-8 4.03-8 9 3.582 9 8 9z" />
            <circle cx="12" cy="13" r="3" fill="currentColor" />
          </svg>
          <input
            type="color"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </label>
      ),
      onClick: () => {}, // No need for action switch, color is separate
    },
    {
      name: "stroke",
      icon: (
        <label className="w-6 h-6 block relative cursor-pointer">
          <svg
            className="w-6 h-6 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path d="M4 12h16" />
          </svg>
          <select
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            value={strokeWidth}
          >
            <option value="1">Thin</option>
            <option value="3">Medium</option>
            <option value="5">Thick</option>
            <option value="8">Extra Thick</option>
          </select>
        </label>
      ),
      onClick: () => {}, // Changing stroke doesn't require action switch
    },
    {
      name: "strokeColor",
      icon: (
        <label className="w-6 h-6 block relative cursor-pointer">
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" fill="none" />
          </svg>
          <input
            type="color"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => setSelectedStrokeColor(e.target.value)}
            value={selectedStrokeColor}
          />
        </label>
      ),
      onClick: () => {}, // No specific action needed on click
    },
    ...zoomControls,
  ];

  const animateZoom = (
    fromScale: number,
    toScale: number,
    fromPos?: { x: number; y: number },
    toPos?: { x: number; y: number }
  ) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const duration = 200;
    const start = Date.now();

    const animate = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      // Interpolate scale
      const currentScale = fromScale + (toScale - fromScale) * easeOut;
      setStageScale(currentScale);

      // Interpolate position if provided
      if (fromPos && toPos) {
        const currentPos = {
          x: fromPos.x + (toPos.x - fromPos.x) * easeOut,
          y: fromPos.y + (toPos.y - fromPos.y) * easeOut,
        };
        setStagePos(currentPos);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  };

  const ZoomToolbar = () => (
    <div className="fixed top-4 right-4 bg-white shadow-2xl rounded-lg px-2 py-2 flex items-center gap-2 border border-gray-200 backdrop-blur-md">
      <button
        onClick={() => zoomOut()}
        className={`p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors ${
          isAnimating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={stageScale <= MIN_SCALE || isAnimating}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </button>

      <span
        className={`text-sm font-mono min-w-[3rem] text-center transition-colors ${
          isAnimating ? "text-blue-500" : "text-gray-700"
        }`}
      >
        {Math.round(stageScale * 100)}%
      </span>

      <button
        onClick={() => zoomIn()}
        className={`p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors ${
          isAnimating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={stageScale >= MAX_SCALE || isAnimating}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
          <line x1="8" y1="11" x2="14" y2="11" />
          <line x1="11" y1="8" x2="11" y2="14" />
        </svg>
      </button>

      <button
        onClick={resetZoom}
        className={`p-2 rounded hover:bg-gray-100 text-gray-600 text-xs transition-colors ${
          isAnimating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isAnimating}
        title="Reset Zoom"
      >
        1:1
      </button>

      <button
        onClick={zoomToFitAll}
        className={`p-2 rounded hover:bg-gray-100 text-gray-600 transition-colors ${
          isAnimating ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isAnimating}
        title="Fit All"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
      </button>
    </div>
  );

  const zoomIn = (centerPoint?: { x: number; y: number }) => {
    const currentScale = stageScale;
    const newScale = Math.min(MAX_SCALE, currentScale * SCALE_BY);

    if (newScale === currentScale) return; // Already at max

    if (centerPoint) {
      // Zoom toward a specific point
      const mousePointTo = {
        x: (centerPoint.x - stagePos.x) / currentScale,
        y: (centerPoint.y - stagePos.y) / currentScale,
      };

      const newPos = {
        x: centerPoint.x - mousePointTo.x * newScale,
        y: centerPoint.y - mousePointTo.y * newScale,
      };

      animateZoom(currentScale, newScale, stagePos, newPos);
    } else {
      // Simple zoom without position change
      animateZoom(currentScale, newScale);
    }
  };

  const zoomOut = (centerPoint?: { x: number; y: number }) => {
    const currentScale = stageScale;
    const newScale = Math.max(MIN_SCALE, currentScale / SCALE_BY);

    if (newScale === currentScale) return; // Already at min

    if (centerPoint) {
      // Zoom toward a specific point
      const mousePointTo = {
        x: (centerPoint.x - stagePos.x) / currentScale,
        y: (centerPoint.y - stagePos.y) / currentScale,
      };

      const newPos = {
        x: centerPoint.x - mousePointTo.x * newScale,
        y: centerPoint.y - mousePointTo.y * newScale,
      };

      animateZoom(currentScale, newScale, stagePos, newPos);
    } else {
      animateZoom(currentScale, newScale);
    }
  };

  const resetZoom = () => {
    const currentScale = stageScale;
    const currentPos = stagePos;
    const targetScale = 1;
    const targetPos = { x: 0, y: 0 };

    animateZoom(currentScale, targetScale, currentPos, targetPos);
  };

  const ZoomDisplay = () => (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-3 py-2 text-sm font-mono border">
      {Math.round(stageScale * 100)}%
    </div>
  );

  const zoomToSelection = (shapes: any[]) => {
    if (shapes.length === 0) return;

    // Calculate bounding box
    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

    shapes.forEach((shape) => {
      if (shape.type === "rectangle") {
        minX = Math.min(minX, shape.x);
        minY = Math.min(minY, shape.y);
        maxX = Math.max(maxX, shape.x + shape.width);
        maxY = Math.max(maxY, shape.y + shape.height);
      } else if (shape.type === "circle") {
        minX = Math.min(minX, shape.x - shape.radius);
        minY = Math.min(minY, shape.y - shape.radius);
        maxX = Math.max(maxX, shape.x + shape.radius);
        maxY = Math.max(maxY, shape.y + shape.radius);
      }
    });

    const padding = 50;
    const contentWidth = maxX - minX + padding * 2;
    const contentHeight = maxY - minY + padding * 2;

    const scaleX = size.width / contentWidth;
    const scaleY = size.height / contentHeight;
    const newScale = Math.min(scaleX, scaleY, MAX_SCALE);

    const newPos = {
      x:
        (size.width - contentWidth * newScale) / 2 -
        (minX - padding) * newScale,
      y:
        (size.height - contentHeight * newScale) / 2 -
        (minY - padding) * newScale,
    };

    animateZoom(stageScale, newScale, stagePos, newPos);
  };

  const zoomToFitAll = () => {
    const allShapes = [...rectangles, ...circles];
    zoomToSelection(allShapes);
  };

  const handleStageMouseDown = (e: any) => {
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();

    // Handle canvas panning (Ctrl+click)
    if (isCtrlPressed) {
      isDragging.current = true;
      dragStart.current = {
        x: pointer.x - stagePos.x,
        y: pointer.y - stagePos.y,
      };
      return; // Exit early, don't create shapes
    }

    // Only create shapes if we're not panning
    // Use relative pointer position for correct coordinates
    const relativePointer = stage.getRelativePointerPosition();

    const id = uuid();
    isPainting.current = true;
    currentShapeId.current = id;

    if (action === ACTIONS.RECTANGLE) {
      setRectangles((rects) => [
        ...rects,
        {
          type: "rectangle",
          id,
          x: relativePointer.x,
          y: relativePointer.y,
          width: 0,
          height: 0,
          fill: selectedColor,
          stroke: selectedStrokeColor,
          strokeWidth: strokeWidth,
        },
      ]);
    } else if (action === ACTIONS.CIRCLE) {
      console.log("circle");
      setCircles((circle) => [
        ...circle,
        {
          type: "circle",
          id,
          x: relativePointer.x,
          y: relativePointer.y,
          fill: selectedColor,
          stroke: selectedStrokeColor,
          strokeWidth: strokeWidth,
        },
      ]);
    }
  };

  const getExistingShapes = async (roomId: string) => {
    const res = await axios.get(`${BACKEND_URL}/api/chats/${roomId}`);
    console.log("getExistingShapes", res);
    const data = res.data.messages;
    console.log("response", res);

    const newCircles: any[] = [];
    const newRectangles: any[] = [];

    const shapesData = data
      .map((x: { message: { shape: any } }) => {
        try {
          const shape = x.message.shape || x.message;
          if (typeof shape === "object") {
            if (shape.radius) {
              newCircles.push({ ...shape, chatId: x?.id });
            }
            if (shape.width && shape.height) {
              newRectangles.push({ ...shape, chatId: x?.id });
            }
          }
          return shape;
        } catch (error) {
          console.error("Invalid shape data:", x.message);
          return null;
        }
      })
      .filter(Boolean);

    setCircles((prev) => [...prev, ...newCircles]);
    setRectangles((prev) => [...prev, ...newRectangles]);
    console.log(shapesData);
    return shapesData;
  };

  const send = (socket: WebSocket, shape: any, roomId: string) => {
    console.log(shape);
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: { shape },
      })
    );
  };

  const updateShape = (socket: WebSocket, shape: any, roomId: string) => {
    console.log("update hit", shape);
    socket.send(
      JSON.stringify({
        type: "update-roomchat",
        id: shape.chatId || shape.id,
        roomId,
        message: { shape },
      })
    );
  };

  const calDis = (x1: number, y1: number, x2: number, y2: number) => {
    console.log(x1, y1, x2, y2);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const handleStageMouseMove = (e: any) => {
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();

    // Handle canvas panning FIRST (highest priority)
    if (isDragging.current && isCtrlPressed) {
      setStagePos({
        x: pointer.x - dragStart.current.x,
        y: pointer.y - dragStart.current.y,
      });
      return; // Exit early, don't do shape drawing
    }

    // Only handle shape drawing if we're not panning
    if (!isPainting.current) return;

    console.log("mouse move - drawing");

    // Get relative pointer position (adjusted for canvas transform)
    const relativePointer = stage.getRelativePointerPosition();

    if (action === ACTIONS.RECTANGLE) {
      setRectangles((rects) =>
        rects.map((rect) =>
          rect.id === currentShapeId.current
            ? {
                ...rect,
                width: relativePointer.x - rect.x,
                height: relativePointer.y - rect.y,
              }
            : rect
        )
      );
    } else if (action === ACTIONS.CIRCLE) {
      setCircles((circles) =>
        circles.map((circ) =>
          circ.id === currentShapeId.current
            ? {
                ...circ,
                radius: calDis(
                  circ.x,
                  circ.y,
                  relativePointer.x,
                  relativePointer.y
                ),
              }
            : circ
        )
      );
    }
  };

  const handleStageMouseUp = () => {
    console.log("mouse up");

    // If we were dragging the canvas, just stop dragging
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }

    // Handle shape creation completion
    const tempId = currentShapeId.current;
    let updatedShape =
      rectangles.find((x) => x.id === tempId) ||
      circles.find((x) => x.id === tempId);

    console.log("updatedShape ", updatedShape);

    if (socket && updatedShape && !updatedShape.chatId) {
      send(socket, updatedShape, roomId);
    }

    isPainting.current = false;
    currentShapeId.current = null;
  };

  const handleWheel = (e: any) => {
    if (isAnimating) return; // Don't zoom while animating

    e.evt.preventDefault();

    const stage = stageRef.current;
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition();

    // Calculate new scale
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    if (clampedScale === oldScale) return; // No change needed

    // Calculate zoom toward mouse position
    const mousePointTo = {
      x: (pointer.x - stagePos.x) / oldScale,
      y: (pointer.y - stagePos.y) / oldScale,
    };

    const newPos = {
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    };

    // Use animation for smooth wheel zoom
    animateZoom(oldScale, clampedScale, stagePos, newPos);
  };

  if (!socket) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-100">
        <p className="mt-6 text-gray-500 text-5xl animate-pulse">
          Connecting to Servers...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-6 left-16 z-50" ref={dropdownRef}>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 bg-white rounded-full shadow-md border hover:bg-gray-50"
          aria-label="Open Profile Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        {open && (
          <div className="mt-2 w-60 rounded-xl shadow-2xl border bg-white backdrop-blur-md">
            <div className="flex flex-col py-2">
              <button className="w-4 h-4">Click</button>
              <button className="w-4 h-4">Click</button>
              <button className="w-4 h-4">Click</button>
              {/* <MenuItem
                icon={<User className="w-4 h-4" />}
                label="Your Profile"
                />
                <MenuItem
                icon={<Settings className="w-4 h-4" />}
                label="Settings"
                />
                <MenuItem
                icon={<HelpCircle className="w-4 h-4" />}
                label="Help"
                /> */}
              <hr className="my-1 border-gray-200" />
              <button className="w-4 h-4">Click</button>
              {/* <MenuItem
                icon={<LogOut className="w-4 h-4 text-red-500" />}
                label="Logout"
                danger
              /> */}
            </div>
          </div>
        )}
      </div>
      {/* Add zoom display */}
      <ZoomDisplay />
      {/* OR add dedicated zoom toolbar */}
      <ZoomToolbar />
      {/* Canvas Area */}
      <Stage
        className="w-full"
        ref={stageRef}
        width={size.width}
        height={size.height - 64}
        x={stagePos.x} // ADD THIS LINE
        y={stagePos.y} // ADD THIS LINE
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        scaleX={stageScale} // ADD THIS
        scaleY={stageScale}
        onWheel={handleWheel}
        onMouseLeave={() => {
          isDragging.current = false;
          isPainting.current = false; // Also reset painting
        }}
        style={{
          background: "#fff",
          pointerEvents: "auto",
          zIndex: 1,
          cursor: isCtrlPressed
            ? isDragging.current
              ? "grabbing"
              : "grab"
            : "crosshair",
        }}
      >
        <Layer>
          {rectangles.map(
            (rect) =>
              rect && (
                // <Rect
                //   key={`rect-${rect.id + uuid()}`}
                //   x={rect.x}
                //   y={rect.y}
                //   width={rect.width}
                //   height={rect.height}
                //   fill={rect.fill}
                //   stroke={rect.stroke}
                //   strokeWidth={2}
                //   draggable={isDraggable}
                //   onClick={(e) => handleRectClick(e, rect.id)}
                // />
                <Rectangle
                  key={rect.id + uuid()}
                  shapeProps={rect}
                  isSelected={rect.id === selected}
                  onSelect={() => {
                    setSelected(rect.id);
                  }}
                  onChange={(newAttrs: any) => {
                    console.log("newAttrs", newAttrs);
                    const rects = rectangles.slice();
                    console.log("rects", rects);
                    // const i = rects.findIndex((r) => r.id === newAttrs.id);
                    // console.log("i", i);
                    // rects[i] = newAttrs;
                    // console.log("rectangle after", rects[i]);
                    updateShape(socket, newAttrs, roomId);
                    // setRectangles(rects);
                    const updatedRects = rectangles.map((r) =>
                      r.id === newAttrs.id ? { ...r, ...newAttrs } : r
                    );
                    setRectangles(updatedRects);
                  }}
                />
              )
          )}
          {circles.map(
            (circle) =>
              circle && (
                // <Circle
                //   key={`circle-${circle.id + uuid()}`}
                //   x={circle.x}
                //   y={circle.y}
                //   radius={circle.radius}
                //   fill={"green"}
                //   stroke={circle.stroke}
                //   strokeWidth={2}
                //   draggable={isDraggable}
                //   onClick={(e) => handleCircClick(e, circle.id)}
                // />
                <CircleShape
                  key={circle.id + uuid()}
                  shapeProps={circle}
                  isSelected={circle.id === selected}
                  onSelect={() => {
                    setSelected(circle.id);
                  }}
                  onChange={(newAttrs: any) => {
                    console.log("newAttrs", newAttrs);
                    const circle = circles.slice();
                    // console.log("circle", circle);
                    // const i = circle.findIndex((r) => r.id === newAttrs.id);
                    // console.log("i", i);
                    // circle[i] = newAttrs;
                    // console.log("circle after", circle);
                    updateShape(socket, newAttrs, roomId);
                    const updatedCircles = circles.map((r) =>
                      r.id === newAttrs.id ? { ...r, ...newAttrs } : r
                    );
                    setCircles(updatedCircles);
                  }}
                />
              )
          )}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      {/* <!-- Floating Shape Selection Bar --> */}
      <div
        className="fixed z-50 
    bottom-6 left-1/2 -translate-x-1/2 
    lg:bottom-auto lg:left-4 lg:top-1/2 lg:-translate-x-0 lg:-translate-y-1/2
    bg-white shadow-2xl rounded-full lg:rounded-xl 
    px-4 py-2 lg:px-2 lg:py-4 
    flex items-center lg:flex-col gap-4 border border-gray-200 backdrop-blur-lg"
      >
        {floatingButtons.map((btn) => (
          <button
            key={btn.name}
            type="button"
            onClick={() => {
              setSelected(btn.name);
              btn.onClick();
            }}
            className={`group relative p-3 rounded-full transition-all duration-200 ease-in-out flex items-center justify-center 
        hover:bg-blue-100 hover:text-blue-600 
        ${selected === btn.name ? "bg-blue-100 ring-2 ring-blue-500 text-blue-600" : "text-gray-600"}`}
            aria-label={btn.name}
          >
            {btn.icon}
            <span
              className="absolute md:left-full md:top-1/2 md:-translate-y-1/2 md:ml-2
        bottom-full mb-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none"
            >
              {btn.name}
            </span>
          </button>
        ))}
      </div>
    </>
  );
};

const MenuItem = ({
  icon,
  label,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) => (
  <button
    className={`flex items-center px-4 py-2 text-sm gap-2 text-left hover:bg-gray-100 w-full ${
      danger ? "text-red-600" : "text-gray-700"
    }`}
  >
    {/* {icon} */}
    <span>{label}</span>
  </button>
);

export default Pages;
