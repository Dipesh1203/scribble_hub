import { initDraw } from "@/app/draw";
import { RoomCanvas } from "@/components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  return <RoomCanvas roomId={roomId} />;
}
