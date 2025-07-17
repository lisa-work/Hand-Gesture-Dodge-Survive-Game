# 🕹️ Dodge & Survive

**Dodge & Survive** is a real-time, gesture-controlled browser game where players use their **hand movements via webcam** to dodge falling obstacles. Built using React, MediaPipe, and the HTML5 Canvas API, this project combines AI-based hand tracking with game logic for an interactive experience — no keyboard required!
### Live Demo: https://hand-gesture-dodge-survive-game.vercel.app/
### Video Demo: https://www.youtube.com/watch?v=gk-fh4xINUU

---

## 🎯 Features

- 🎮 Real-time obstacle dodging game
- ✋ AI-powered hand gesture control using webcam
- 📷 Integrated MediaPipe Hands via `@mediapipe/tasks-vision`
- 🧠 Collision detection and score/lives system
- 🔁 Smooth game loop with `requestAnimationFrame`
- 🎨 Fully responsive UI with Tailwind CSS

---
### 🔧 Areas for Improvement
While the game is fully functional, there are several enhancements and optimizations that could improve the user experience and performance:

#### 🧠 Gesture Detection
Smoother gesture tracking: Use Kalman filters or moving average to reduce jitter and false positives.

Multi-hand support: Currently only tracks one hand — could be extended to support both for advanced controls.

Custom gesture classification: Expand beyond simple left/right detection to include gestures like pause, jump, or shield.

#### 🎮 Gameplay Mechanics
Dynamic difficulty: Gradually increase speed or spawn rate of falling objects based on score.

Power-ups: Add invincibility, slow-motion, or score multipliers to increase engagement.

Enhanced collision detection: Use pixel-perfect or bounding circle detection for more accurate gameplay.

#### 📷 UX / Visual Feedback
Visual guide for hand gestures: Help users calibrate their hand at the start.

Gesture preview HUD: Display which gesture is currently being detected (left, right, idle).

Optional webcam toggle: Allow users to show/hide their webcam feed.

#### 🌍 Accessibility & Compatibility
Fallback controls: Allow keyboard controls if camera isn't available or supported.

Mobile support: Detect mobile devices and display an alternate message or mobile control.

Browser support testing: Improve compatibility with Safari and Firefox for webcam + gesture detection.

#### 📊 Performance
Optimize rendering: Use offscreen canvas or requestAnimationFrame throttling for better FPS on low-end devices.

GPU/CPU fallback detection: Dynamically select MediaPipe delegate based on device capabilities.

#### 🌐 Online Features (Future Scope)
Leaderboard integration: Use Supabase or Firebase to store high scores.

User login & score history: Let users sign in and track progress over time.

Multiplayer support: Play side-by-side games with friends and compare scores live.

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
```

### 2. 🧪 Recommended Test Positions
This section outlines the ideal gestures and user positioning for accurate control during gameplay.

Gesture	Description
✋ Hand Center	Place your open hand in the center of the camera frame to keep the player still.

🡐 Move Left	Move your hand toward the left third of the camera view (your left, not mirrored).

🡒 Move Right	Move your hand toward the right third of the camera view.

### 3. 📸 Camera & Environment Tips
Ensure your background is clean and hand is visible (avoid cluttered scenes).

Keep your hand open and within the camera frame at all times.

Good lighting improves hand landmark detection — avoid backlighting or low-light setups.

Sit around 40–70 cm from the webcam for optimal detection.
