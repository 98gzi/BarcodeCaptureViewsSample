import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    flexDirection: "column",
  },
  childrenContainer: {
    flex: 1,
  },
  item: {
    flex: 1,
    height: 55,
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingLeft: 25,
    paddingRight: 25,
  },
  fullScreenView: {
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "orange",
    margin: 5,
  },
});
