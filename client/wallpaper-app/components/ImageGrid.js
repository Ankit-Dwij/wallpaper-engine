import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import { getColumnsCount, wp } from "../helpers/common";

const ImageGrid = ({ images }) => {
  // console.log("grid\n\n", images);

  const columns = getColumnsCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        contentContainerStyle={styles.listContainerStyle}
        initialNumToRender={1000}
        renderItem={({ item, index }) => (
          <ImageCard item={item} index={index} columns={columns} />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});

export default ImageGrid;
