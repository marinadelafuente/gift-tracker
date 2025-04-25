import 'nativewind';
import { 
  ViewProps, 
  TextProps, 
  TouchableOpacityProps, 
  TextInputProps,
  SafeAreaViewProps,
  FlatListProps
} from 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
  interface FlatListProps<ItemT> {
    className?: string;
  }
}

declare module 'nativewind' {
  interface NativeWindStyleSheet {
    process(css: string): Promise<string>;
  }
} 