import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { FullScreenView } from "./views/FullScreenView";
import TextInputPage from "./views/TextInputPage";

const Stack = createStackNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="textInput">
      <Stack.Screen
          name="textInput"
          component={TextInputPage}
          options={{ title: "Text Input Page" }}
        />
        <Stack.Screen
          name="fs"
          component={FullScreenView}
          options={{ title: "Full Screen" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
