import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  findNodeHandle,
  UIManager,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  /**
   * Reference to parent ScrollView for auto-scroll on focus
   */
  scrollViewRef?: React.RefObject<any>;
}

export function Input({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  scrollViewRef,
  onFocus,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textColor = useThemeColor({}, 'text');
  const inputRef = useRef<TextInput>(null);
  const containerRef = useRef<View>(null);

  const isPassword = secureTextEntry !== undefined;
  const showPassword = isPassword && !isPasswordVisible;

  const handleFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      
      // Scroll to input when focused (if scrollViewRef is provided)
      if (scrollViewRef?.current && containerRef.current) {
        // Small delay to let keyboard animation start
        setTimeout(() => {
          containerRef.current?.measureLayout(
            findNodeHandle(scrollViewRef.current) as number,
            (x, y) => {
              scrollViewRef.current?.scrollTo({
                y: Math.max(0, y - 100), // 100px offset from top
                animated: true,
              });
            },
            () => {} // Error handler
          );
        }, 100);
      }

      onFocus?.(e);
    },
    [onFocus, scrollViewRef]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return (
    <View ref={containerRef} style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: textColor }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: '#f1f5f9',
            borderColor: error ? '#dc2626' : isFocused ? '#2563eb' : '#e2e8f0',
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? '#2563eb' : '#64748b'}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: '#1e293b' },
            leftIcon ? { paddingLeft: 0 } : null,
          ]}
          placeholderTextColor="#94a3b8"
          secureTextEntry={showPassword}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#64748b"
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity 
            onPress={onRightIconPress} 
            style={styles.rightIcon}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIcon} size={20} color="#64748b" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    minHeight: 52,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 12,
  },
  rightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
});
