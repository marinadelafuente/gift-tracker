import Svg, { Path } from 'react-native-svg';
import { IconProps, ChevronDirection } from './types';

interface ChevronIconProps extends IconProps {
  direction?: ChevronDirection;
}

const getPath = (direction: ChevronDirection): string => {
  switch (direction) {
    case 'left':
      return 'M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z';
    case 'up':
      return 'M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z';
    case 'down':
      return 'M7.41,8.59L12,13.17L16.59,8.59L18,10L12,16L6,10L7.41,8.59Z';
    default: // right
      return 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z';
  }
};

export default function ChevronIcon({
  size = 20,
  color = '#9CA3AF',
  direction = 'right',
}: ChevronIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d={getPath(direction)} />
    </Svg>
  );
}
