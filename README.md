# React Native Gift Tracker App

A gift tracking application built with React Native and Expo, helping you organize gift ideas for your loved ones. Keep track of gift ideas, prices, and whether they've been purchased.

## Features

- Manage gift recipients with customizable avatars
- Add gift ideas with details like:
  - Name and price
  - Description
  - Store/Brand information
  - Images (from camera or gallery)
  - URLs for online purchases
- Mark gifts as purchased/unpurchased
- Organize gifts by recipient
- Modern and intuitive UI with smooth animations
- Data persistence between app launches


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
- `app/`
  - `_layout.tsx` - App layout and navigation setup
  - `index.tsx` - Home screen with recipient list
  - `recipients/[id].tsx` - Individual recipient's gifts screen
- `components/`
  - `RecipientList.tsx` - Recipients list management
  - `RecipientItem.tsx` - Individual recipient component
  - `RecipientModal.tsx` - Add/edit recipient modal
  - `GiftList.tsx` - Gifts list management
  - `GiftItem.tsx` - Individual gift component
  - `GiftModal.tsx` - Add/edit gift modal
  - `Accordion.tsx` - Expandable section component
- `assets/`
  - `icons/` - Custom icon components
- `helpers/`
  - `formatDate.ts` - Date formatting utilities
  - `getAvatarUrl.ts` - Avatar generation utilities

## Technologies Used

- React Native
- Expo
- TypeScript
- NativeWind (TailwindCSS for React Native)
- Expo Router for navigation
- Expo Image Picker for camera/gallery access
- React Native SVG for custom icons
