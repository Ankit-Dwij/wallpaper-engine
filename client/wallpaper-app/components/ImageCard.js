import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { theme } from "../constants/theme";
import { wp } from "../helpers/common";

const ImageCard = ({ item, index, columns }) => {
  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };

  return (
    <Pressable style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
      <Image
        style={styles.image}
        source={item?.download_link}
        transition={100}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: { height: 300, width: "100%" },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
});
export default ImageCard;
