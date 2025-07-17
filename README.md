# 🕹️ Dodge & Survive

**Dodge & Survive** is a real-time, gesture-controlled browser game where players use their **hand movements via webcam** to dodge falling obstacles. Built using React, MediaPipe, and the HTML5 Canvas API, this project combines AI-based hand tracking with game logic for an interactive experience — no keyboard required!
### Live Demo: https://hand-gesture-dodge-survive-game.vercel.app/
---

## 🎯 Features

- 🎮 Real-time obstacle dodging game
- ✋ AI-powered hand gesture control using webcam
- 📷 Integrated MediaPipe Hands via `@mediapipe/tasks-vision`
- 🧠 Collision detection and score/lives system
- 🔁 Smooth game loop with `requestAnimationFrame`
- 🎨 Fully responsive UI with Tailwind CSS

---

## 🛠️ Tech Stack

| Area              | Technology                             |
|-------------------|-----------------------------------------|
| Frontend          | React 18, TypeScript                    |
| Styling           | Tailwind CSS v3                         |
| Hand Detection    | @mediapipe/tasks-vision, react-webcam   |
| Game Engine       | HTML5 Canvas API                        |
| State Management  | React Hooks (`useState`, `useEffect`)   |
| Animation Loop    | requestAnimationFrame                   |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/dodge-survive.git
cd dodge-survive
