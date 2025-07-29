import * as React from 'react';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import TaskScreen from './src/screens/TaskScreen';

const theme = {
  ...DefaultTheme,
  roundness: 6,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50', 
    accent: '#A5D6A7',
    background: '#F2F2F2', 
    surface: '#FFFFFF',
    text: '#333333',
    placeholder: '#888888',
    disabled: '#CCCCCC',
    onSurface: '#444444',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
        <TaskScreen />
    </PaperProvider>
  );
}