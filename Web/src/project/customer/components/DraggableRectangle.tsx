import { Rect, Line, Group, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useState } from "react";
import { Rectangle } from "../interfaces";

interface Props extends Rectangle {
  imgUrl: string;
  onAddLine: (id: number) => void;
  onRemoveLine: (id: number) => void;
  onDelete: () => void;
  stageWidth: number;
  stageHeight: number;
  isCustom?: boolean;
}

export const DraggableRectangle = ({
  id,
  x,
  y,
  lines,
  size,
  imgUrl,
  onAddLine,
  onRemoveLine,
  onDelete,
  stageWidth,
  stageHeight,
  lineColor,
  lineSpacingFactor,
  isCustom = false,
}: Props) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imgUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      setImage(img);
    };
  }, [imgUrl]);

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    const newPosition = {
      x: e.target.x(),
      y: e.target.y(),
    };
    setPosition(newPosition);
  };

  const handleDragEnd = () => {
    // Aquí puedes realizar cualquier acción necesaria al finalizar el arrastre
  };

  const lineHeight = 25 * lineSpacingFactor; // Altura de la línea ajustada por el factor de separación
  const padding = 5;
  const rectHeight = lineHeight * lines.length + padding * 2;
  const rectWidth = size * 10 + padding * 2;

  return (
    <Group
      x={position.x}
      y={position.y}
      draggable
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      dragBoundFunc={(pos) => {
        const newX = Math.max(0, Math.min(stageWidth - rectWidth, pos.x));
        const newY = Math.max(0, Math.min(stageHeight - rectHeight, pos.y));
        return { x: newX, y: newY };
      }}
    >
      {image && (
        <Rect
          x={0}
          y={0}
          cornerRadius={5}
          width={rectWidth}
          height={rectHeight}
          stroke="gray"
          strokeWidth={3}
          fillPatternImage={image}
          fillPatternRepeat="repeat"
        />
      )}
      {lines.map((_line, index) => (
        <Line
          key={index}
          points={[
            0 + padding,
            (rectHeight - padding * 2) * ((index + 0.5) / lines.length) +
              padding,
            rectWidth - padding,
            (rectHeight - padding * 2) * ((index + 0.5) / lines.length) +
              padding,
          ]}
          stroke={lineColor}
          strokeWidth={2}
        />
      ))}
      {isCustom && (
        <>
          <Group x={0} y={rectHeight + 10}>
            <Rect width={30} height={30} fill="green" cornerRadius={100} />
            <Text
              text="+"
              fontSize={20}
              x={5}
              y={5}
              width={20}
              height={20}
              align="center"
              fontStyle="bold"
              fill="white"
              onClick={() => onAddLine(id)}
            />
          </Group>
          <Group x={40} y={rectHeight + 10}>
            <Rect width={30} height={30} fill="red" cornerRadius={100} />
            <Text
              text="-"
              fontSize={20}
              x={5}
              y={5}
              width={20}
              height={20}
              align="center"
              fill="white"
              fontStyle="bold"
              onClick={() => onRemoveLine(id)}
            />
          </Group>
        </>
      )}
      <Group x={80} y={rectHeight + 10}>
        <Rect width={30} height={30} fill="red" cornerRadius={100} />
        <Text
          text="x"
          fontSize={20}
          x={5}
          y={5}
          width={20}
          height={20}
          fill="white"
          align="center"
          fontStyle="bold"
          onClick={onDelete}
        />
      </Group>
    </Group>
  );
};
