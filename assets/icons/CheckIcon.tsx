import Svg, { Path } from 'react-native-svg';
import { IconProps } from './types';

export default function CheckIcon({ size = 20, color = '#10B981' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
    </Svg>
  );
} 