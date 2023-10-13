'use client';

/* eslint-disable @next/next/no-img-element */
import { FC, RefObject, useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { Stage, Layer, Circle, Image as KonvaImage } from 'react-konva';

import { DetectFaceData } from '@src/types';
import useThrottle from '@src/hooks/useThrottle';
import useWindowSize from '@src/hooks/useWindowSize';

interface FaceScannerProps {
  previewURL: string;
  imgRef: RefObject<HTMLDivElement>;
  detectedFaceData?: DetectFaceData;
  setIsLoading: (value: boolean) => void;
  isDataPredicted: boolean;
}

const FaceScanner: FC<FaceScannerProps> = function ({
  previewURL,
  imgRef,
  detectedFaceData,
  setIsLoading,
  isDataPredicted
}) {
  const { width, height } = useThrottle(useWindowSize());
  const [img, setImg] = useState<HTMLImageElement>();
  const [dimensions, setDimensions] = useState<[number, number]>([0, 0]);
  const [dots, setDots] = useState<DetectFaceData>();

  const createHtmlImg = (url: string) => {
    const image = new Image();
    image.src = url;
    image.onload = () => {
      setImg(image);
    };
  };

  const calculateDimensions = () => {
    const isMobile = window.innerWidth < 768;
    let availableWidth, availableHeight;

    if (isMobile) {
      if (isDataPredicted) {
        availableWidth = 0;
        availableHeight = imgRef.current?.clientHeight || 0;
      } else {
        availableWidth = window.innerWidth - 32;
        availableHeight = 0;
      }
    } else {
      availableWidth = imgRef.current?.clientWidth || 0;
      availableHeight = 0;
    }

    const aspectRatio = img ? img.naturalHeight / img.naturalWidth : 1;

    const calculatedHeight = availableHeight || availableWidth * aspectRatio;
    const calculatedWidth = availableWidth || availableHeight * aspectRatio;

    setDimensions([calculatedWidth, calculatedHeight]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (previewURL) {
      createHtmlImg(previewURL);
    }
  }, [previewURL]);

  useEffect(() => {
    if (img) {
      calculateDimensions();
    }
  }, [img, isDataPredicted, detectedFaceData, width, height]);

  useEffect(() => {
    if (detectedFaceData && img) {
      const modifiedData = detectedFaceData.map((dataSet) =>
        dataSet.map(([x, y]) => [
          x * (dimensions[0] / img.naturalWidth),
          y * (dimensions[1] / img.naturalHeight)
        ])
      ) as DetectFaceData;
      setDots(modifiedData);
    }
  }, [dimensions]);

  return (
    <>
      {img ? (
        <Stage width={dimensions[0]} height={dimensions[1]}>
          <Layer>
            <KonvaImage
              width={dimensions[0]}
              height={dimensions[1]}
              image={img}
              alt={'User image preview'}
            />

            {dots
              ? ['red', 'blue'].map((color, index) =>
                  dots[index].map(([x, y], index) => (
                    <AnimatedDot key={index} color={color} x={x} y={y} />
                  ))
                )
              : null}
          </Layer>
        </Stage>
      ) : null}
    </>
  );
};

type DotProps = {
  x: number;
  y: number;
  color: string;
};

const AnimatedDot: FC<DotProps> = ({ x, y, color }) => {
  const dotRef = useRef(null);

  useEffect(() => {
    if (dotRef.current) {
      const tween = new Konva.Tween({
        node: dotRef.current,
        duration: 0.8, // This can be adjusted for speed
        scaleX: 1.2, // The scale range can also be adjusted
        scaleY: 1.2,
        yoyo: true, // This makes the animation reverse and repeat
        repeat: -1, // Infinite repeat
        easing: Konva.Easings.EaseInOut
      });
      tween.play();
    }
  }, []);

  return (
    <Circle
      ref={dotRef}
      x={x}
      y={y}
      radius={3}
      fill={color}
      scaleX={0} // initial scale
      scaleY={0} // initial scale
    />
  );
};

export default FaceScanner;
