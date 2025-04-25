# React Native Todo App Example

A simple todo list application built with React Native and Expo, demonstrating core concepts like:
- Components and Props
- State Management
- AsyncStorage for data persistence
- TypeScript integration
- Styling with StyleSheet

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Persist todos between app launches
- Clean and modern UI

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac users) or Android Emulator
- Expo Go app on your physical device (optional)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
- Press `i` to run on iOS Simulator
- Press `a` to run on Android Emulator
- Scan the QR code with Expo Go app on your device

## Project Structure

- `App.tsx` - Main application component
- `components/`
  - `TodoList.tsx` - Todo list component with state management
  - `TodoItem.tsx` - Individual todo item component
- `babel.config.js` - Babel configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts

## Technologies Used

- React Native
- Expo
- TypeScript
- @react-native-async-storage/async-storage 