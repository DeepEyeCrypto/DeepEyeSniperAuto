# Contributing to DeepEyeSniper

Welcome to the DeepEyeSniper community! We are thrilled to have you here. This project is at the intersection of high-frequency trading (Rust) and premium visual experience (Vite/CSS).

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **Rust**: Latest stable (v1.75+)
- **System Deps**:
  - macOS: Xcode Command Line Tools.
  - Linux (Ubuntu): `libwebkit2gtk-4.1-dev`, `build-essential`, `curl`, `wget`, `file`, `libssl-dev`, `libgtk-3-dev`, `libayatana-appindicator3-dev`, `librsvg2-dev`.

### Local Setup

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/DeepEyeSniperAuto.git`
3. Install frontend dependencies: `npm install`
4. Run in development: `npm run dev`

## 🛠 Project Structure

- `/index.html`: Main UI (Vite-powered).
- `/src-tauri`: Rust backend (Price engines, WebSocket, OS management).
- `/scripts`: Build automation and versioning logic.

## 🤝 Contribution Workflow

1. **Find an Issue**: Look for [Good First Issues](link-to-issues) or check the [GitHub Project Radar](link-to-projects).
2. **Feature Branches**: Use descriptive branch names: `feat/amazing-strategy` or `fix/ui-glow`.
3. **Pull Requests**: Provide a clear summary of changes and reference any related issues.

## 🎨 Style Guidelines

### Rust

- Run `cargo fmt` before committing.
- Favor zero-copy deserialization for performance-critical path.

### TypeScript / HTML

- Use CSS variables for theming.
- Ensure all new components follow the "Glassmorphism" aesthetic.

## 🌟 GitHub Discussions

Have an idea for a new trading strategy? Join the [Development Discussions](link-to-discussions) to pitch your vision.
