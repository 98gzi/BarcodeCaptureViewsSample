import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { MainPage } from "./MainPage";
import { FullScreenView } from "./views/FullScreenView";

const Stack = createStackNavigator();

export const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="mainPage">
        <Stack.Screen
          name="mainPage"
          component={MainPage}
          options={{ title: "Main Page" }}
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
