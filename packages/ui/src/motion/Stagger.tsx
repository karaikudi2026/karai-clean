import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { motion } from "../tokens/motion";

type StaggerItemProps = {
  index: number;
  children: React.ReactNode;
  staggerMs?: number;
  baseDelay?: number;
};

export function StaggerItem({
  index,
  children,
  staggerMs = motion.stagger.normal,
  baseDelay = 0,
}: StaggerItemProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(motion.duration.normal)
        .delay(baseDelay + index * staggerMs)
        .springify()
        .damping(16)}
    >
      {children}
    </Animated.View>
  );
}

type StaggerListProps = {
  children: React.ReactNode;
  staggerMs?: number;
  baseDelay?: number;
};

export function StaggerList({
  children,
  staggerMs,
  baseDelay,
}: StaggerListProps) {
  return (
    <>
      {React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <StaggerItem
            key={index}
            index={index}
            staggerMs={staggerMs}
            baseDelay={baseDelay}
          >
            {child}
          </StaggerItem>
        ) : null
      )}
    </>
  );
}
