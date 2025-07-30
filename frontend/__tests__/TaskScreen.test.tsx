import React from "react";
import { render} from "@testing-library/react-native";
import TaskScreen from "../src/screens/TaskScreen";
import { PaperProvider } from "react-native-paper";

jest.mock("react-native-paper", () => {
  const original = jest.requireActual("react-native-paper");

  return {
    ...original,
    FAB: (props: any) => {
      return (
        <original.Button
          onPress={props.onPress}
          children={props.label || "FAB"}
          testID="mock-fab"
        />
      );
    },
  };
});

describe("TaskScreen", () => {
  it("renderiza corretamente",() => {
    render(<PaperProvider><TaskScreen /></PaperProvider>);
  });
});