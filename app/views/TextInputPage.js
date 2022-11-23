import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useCallback, useState } from "react";
import { styles } from "../styles";
import { ScanditContainer } from "../ScanditContainer";

const TextInputPage = ({ navigation }) => {
  const [text, setText] = useState("");

  const fillTextBoxFromScanner = useCallback((barcode) => {
    setText(barcode);
  }, []);

  return (
    <ScanditContainer
      navigation={navigation}
      onScan={(barcode) => fillTextBoxFromScanner(barcode)}
    >
      <View>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
        />
      </View>
    </ScanditContainer>
  );
};

export default TextInputPage;
