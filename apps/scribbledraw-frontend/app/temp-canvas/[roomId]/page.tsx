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
import { on } from "events";
import ProfileDropdown from "@/components/ProfileDropdown";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Rectangle } from "@/components/konva-shapes/Rectangle";
import { CircleShape } from "@/components/konva-shapes/CircleShape";

const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  SCRIBBLE: "SCRIBBLE",
  ARROW: "ARROW",
  DELETE: "DELETE",
  TEXT: "TEXT",
};

const strokeColor = "black";
const fillColor = "#fff";
const isDraggable = true;

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
  const [action, setAction] = useState(ACTIONS.RECTANGLE);
  const { data, status } = useSession();
  const [selected, setSelected] = useState<string | null>(null);
  const session = data as Session;
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 800,
    height: typeof window !== "undefined" ? window.innerHeight : 600,
  });
  const fill = "rgb(0,10,0,10)";

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
  ];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
  // Drawing logic
  const isPainting = useRef(false);
  const currentShapeId = useRef<string | null>(null);

  const handleStageMouseDown = (e: any) => {
    // if (action !== ACTIONS.RECTANGLE) return;
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    const id = uuid();
    isPainting.current = true;
    currentShapeId.current = id;
    if (action === ACTIONS.RECTANGLE) {
      setRectangles((rects) => [
        ...rects,
        {
          type: "rectangle",
          id,
          x: pointer.x,
          y: pointer.y,
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
          x: pointer.x,
          y: pointer.y,
          fill: selectedColor,
          stroke: selectedStrokeColor,
          strokeWidth: strokeWidth,
        },
      ]);
    }
  };

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

  const handleStageMouseMove = (e: any) => {
    console.log("mouse move");
    if (!isPainting.current) return;
    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    if (action === ACTIONS.RECTANGLE) {
      setRectangles((rects) =>
        rects.map((rect) =>
          rect.id === currentShapeId.current
            ? { ...rect, width: pointer.x - rect.x, height: pointer.y - rect.y }
            : rect
        )
      );
    } else if (action === ACTIONS.CIRCLE) {
      setCircles((circles) =>
        circles.map((circ) =>
          circ.id === currentShapeId.current
            ? { ...circ, radius: calDis(circ.x, circ.y, pointer.x, pointer.y) }
            : circ
        )
      );
    }
  };

  const calDis = (x1: number, y1: number, x2: number, y2: number) => {
    console.log(x1, y1, x2, y2);
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const handleStageMouseUp = () => {
    console.log("mouse up");
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

  const handleRectClick = (e: any, id: string) => {
    if (action !== ACTIONS.SELECT) return;
    const shape = e.target;
    console.log("rect ", shape);
    transformerRef.current.nodes([shape]);
    transformerRef.current.getLayer().batchDraw();
  };

  const handleCircClick = (e: any, id: string) => {
    if (action !== ACTIONS.SELECT) return;
    const shape = e.target;
    console.log(shape);
    transformerRef.current.nodes([shape]);
    transformerRef.current.getLayer().batchDraw();
  };

  if (!socket) {
    return <div>Connecting to Servers............</div>;
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
      {/* <div className="fixed top-6 left-13 -translate-x-1/4 bg-white shadow-2xl rounded-2xl px-4 py-2 flex items-center gap-4 z-50 border border-gray-200 backdrop-blur-md">
        <button>Click</button>
      </div> */}
      {/* Canvas Area */}
      <Stage
        className="w-full"
        ref={stageRef}
        width={size.width}
        height={size.height - 64}
        onMouseDown={handleStageMouseDown}
        // style={{  }}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        style={{ background: "#fff", pointerEvents: "auto", zIndex: 1 }}
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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-full px-4 py-2 flex items-center gap-4 z-50 border border-gray-200 backdrop-blur-md">
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
            <span className="absolute bottom-full mb-2 px-2 py-1 text-xs rounded bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition pointer-events-none">
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
