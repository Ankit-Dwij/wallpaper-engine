import { View, Text, StyleSheet } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

const FiltersModal = ({ ref }) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal ref={ref} index={0} snapPoints={snapPoints}>
      <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({});

export default FiltersModal;
