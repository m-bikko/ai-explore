# 🚀 AI Explore

**Visualize LLM Streams & Data in Real-Time.**

AI Explore is a modern Next.js application designed to bring raw LLM outputs to life. It captures streaming text and code from a `.jsonl` dump, simulates a real-time server connection, and magically extracts & renders **Vega-Lite** charts dynamically as they appear in the conversation.

---

## ✨ Features

### 🧠 Core Intelligence
*   **Real-time Emulation**: Simulates a live Server-Sent Events (SSE) stream from a static dump file.
*   **Dynamic Parsing**: Intelligently detects and renders generic text alongside complex Vega-Lite chart specifications.

### 🎨 Dual Interface Modes
Switch instantly between two powerful views:

1.  **📊 Dashboard Mode** (Classic)
    *   A professional, split-pane layout.
    *   Perfect for debugging and analyzing raw data vs. visual output side-by-side.

2.  **💬 Chat Bot Mode** (Modern)
    *   A sleek, conversational interface inspired by tools like ChatGPT.
    *   **Immersive Visuals**: Charts appear *inside* the chat bubbles, seamlessly integrated with the text.
    *   **Smart Controls**: Playback controls are tucked away at the bottom, just like a chat input bar.

### 🎛️ Full Control
*   **Playback**: Play, Pause, and Replay the stream at will.
*   **Speed Board**: A dedicated control center to speed up (up to 5x) or slow down the stream to analyze details.
*   **Mobile Ready**: Fully responsive design that feels native on phones and tablets.

---

## 🛠️ Tech Stack

Built with love using the cutting-edge Vercel stack:

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
*   **Charts**: [Vega-Lite](https://vega.github.io/vega-lite/) via `react-vega`
*   **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

Follow these simple steps to run the project locally:

### 1. Installation
Clone the repo and install dependencies:

```bash
git clone 
```

```bash
npm install
```

### 2. Run Locally
Start the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Usage Guide
1.  **Toggle Mode**: Use the switch in the top-right corner to choose **Dashboard** or **Chat** view.
2.  **Load Data**: Click the **Load Dump** button (bottom right in Chat mode, top left in Dashboard) and select `llm_stream_dump.jsonl`.
3.  **Start Stream**: Hit the **▶ Play** button.
4.  **Watch Magic**: See text stream in real-time and watch the chart build itself! 📉

---

*Made for Vibe Coding Tezt.*
