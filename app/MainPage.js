import React, { useState } from "react";
import {
  Button,
  View,
} from "react-native";

import { styles } from "./styles";


export const MainPage = ({ navigation }) => {
  const handleClick = () => {
    navigation.navigate("fs");
  };

  return (
    <View style={styles.mainPage}>
      <Button title="Open Scanner" onPress={handleClick} />
    </View>
  );
};
