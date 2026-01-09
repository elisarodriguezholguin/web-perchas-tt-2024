import { Image as KonvaImage } from "react-konva";
import useImage from "use-image";

interface Props {
  url: string;
  width: number;
  height: number;
}

export const BackgroundImageKonva = ({ url, width, height }: Props) => {
  const [image] = useImage(url, "anonymous");
  return (
    <KonvaImage image={image} opacity={0.9} width={width} height={height} />
  );
};
