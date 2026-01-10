# 👻 GhostShare

**GhostShare** is a stealthy, high-performance P2P file sharing web application built for privacy-conscious users. It establishes a direct "Ghost Tunnel" between two browsers using WebRTC, ensuring that your files never touch a central server.

## 🚀 Features

- **Direct P2P Transfer**: Browser-to-browser communication using PeerJS (WebRTC).
- **Zero Server Storage**: Your files are streamed directly in chunks; nothing is uploaded to the cloud.
- **Stealth UI**: A minimalist, glassmorphic design optimized for both desktop and mobile.
- **High Performance**: Large files are handled via 16KB chunking to prevent browser memory exhaustion.
- **Privacy First**: Temporary cryptographic IDs that vanish when the tab is closed.
- **QR Integration**: Easy mobile pairing with instant QR code generation.

## 🛠️ Technical Stack

- **React 19**: Modern UI component architecture.
- **Tailwind CSS**: Rapid, responsive, and beautiful styling.
- **PeerJS**: Robust WebRTC abstraction for signaling and data channels.
- **Lucide React**: Clean and consistent iconography.
- **Vite/ESM**: Blazing fast development and modular imports.

## 🔒 Security Architecture

GhostShare operates on a "Privacy by Architecture" model:
1. **Signaling**: Uses a public signaling server solely to exchange connection metadata (ICE candidates).
2. **Encryption**: Data transferred over WebRTC DataChannels is encrypted via DTLS by default in modern browsers.
3. **Volatility**: No database, no logs, no persistence.

## 📖 How to Use

1. **Open** GhostShare on both devices.
2. **Share** your Ghost ID or show your QR code to the receiver.
3. **Connect**: The receiver enters the sender's ID and clicks the arrow.
4. **Transfer**: Once the "Direct Tunnel" is green, drag and drop files into the zone.

---
*Created by the GhostShare Protocol Team. Stealth. Speed. Security.*
