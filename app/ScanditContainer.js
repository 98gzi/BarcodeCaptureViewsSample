import React, { useCallback, useState } from "react";
import { Button, View } from "react-native";

import { styles } from "./styles";

export const ScanditContainer = ({ navigation, children, onScan }) => {
  const showScandit = (onScan) => {
    navigation.navigate("fs", { getScanCode: (scanCode) => onScan(scanCode) });
  };
  const onShowScandit = useCallback(() => {
    showScandit((scanCode) => onScan(scanCode));
  }, []);

  return (
    <View style={styles.mainPage}>
      <View style={styles.childrenContainer}>{children}</View>
      <Button title="Open Scanner" onPress={onShowScandit} />
    </View>
  );
};
