# Web Viewer

A desktop application for managing web content with Electron, React, and TypeScript.

## Features

- **Menu Management System**
  Create and configure menu items with window settings
- **Responsive Layout**
  Optimized UI with bug-fixed homepage layout
- **Windows Packaging**
  Optimized build process for Windows distribution
- **Button Group Support**
  Manage groups of actions within menus

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Building
```bash
# Build for Windows (optimized)
npm run build:win

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

## Project Structure
- `src/main/`: Electron main process
- `src/renderer/`: React application
  - `src/renderer/src/views/menus/`: Menu components and configuration

## Tips
- **Windows Users**: If you encounter encoding issues, run "chcp 65001 && electron-vite dev" before development

## License
[MIT](LICENSE)
