import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export function LoadingSymbol() {
  const squareSize = 26;
  const offset = 30;
  const duration = 2000;

  // Create animated values for the positions and color
  const positions = Array.from({ length: 5 }).map(
    () => useRef(new Animated.ValueXY({ x: 0, y: 0 })).current
  );
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Loop animation for positions
  const animateSquares = () => {
    positions.forEach((position, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(position, {
            toValue: { x: offset * index, y: 0 },
            duration: duration / 4,
            useNativeDriver: false,
          }),
          Animated.timing(position, {
            toValue: { x: offset * index, y: offset },
            duration: duration / 4,
            useNativeDriver: false,
          }),
          Animated.timing(position, {
            toValue: { x: 0, y: offset },
            duration: duration / 4,
            useNativeDriver: false,
          }),
          Animated.timing(position, {
            toValue: { x: 0, y: 0 },
            duration: duration / 4,
            useNativeDriver: false,
          }),
        ])
      ).start();
    });
  };

  // Loop animation for color
  const animateColors = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateSquares();
    animateColors();
  }, []);

  // Interpolate the background color between green and purple
  const interpolatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#7FFBD2", "#4724F5"], // Light green to purple
  });

  return (
    <View style={styles.container}>
      {positions.map((position, index) => (
        <Animated.View
          key={index}
          style={[
            styles.square,
            {
              backgroundColor: interpolatedColor,
              transform: [
                { translateX: position.x },
                { translateY: position.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 4 * 30 + 26,
    height: 2 * 30 + 26,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  square: {
    width: 26,
    height: 26,
    position: "absolute",
    borderRadius: 4,
  },
});
