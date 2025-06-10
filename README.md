# 🎮 Pixel Attack

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-yellow)](https://www.javascript.com)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green)](https://github.com/blobpetal/pixel-attack)

A retro-style pixel art balls clicking game with power-ups, combos, and dynamic effects. Built with vanilla JavaScript, HTML, and CSS.

![Pixel Attack Game](https://raw.githubusercontent.com/blobpetal/pixel-attack/main/screenshot.png)

Play Pixel Attact: https://pixel-attack.netlify.app

## ✨ Features

- 🎯 Pixel-perfect clicking mechanics
- ⚡ Dynamic power-ups (Time Freeze, Strike, Bomb)
- 🔥 Combo system with multipliers
- 🌓 Light/Dark theme support
- 🎨 Retro pixel art style
- 📱 Responsive design
- 🏆 High score tracking
- 🎮 Custom pixel cursor

## 🎮 How to Play

1. Click the "Start Game" button to begin
2. Click balls to earn points:
   - Normal Ball: 3 points
   - Small Ball: 5 points
   - Large Ball: 1 point
3. Build combos by clicking balls quickly
4. Collect power-ups:
   - ⏰ Time Freeze: Adds 3 seconds
   - ⚡ Strike: Collects all non-bomb balls
   - 💣 Bomb: Reduces time by 5 seconds

## 🛠️ Technologies Used

- HTML5
- CSS3 (Custom Properties, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Google Fonts (VT323)
- Local Storage API

## 🚀 Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/blobpetal/pixel-attack.git
   ```

2. Open `index.html` in your browser or use a local server:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve
   ```

3. Start playing! 🎮

## 🎨 Customization

The game uses CSS custom properties for easy customization:

```css
:root {
  --accent-color: #4caf50;
  --pixel-size: 4px;
  --grid-size: 16px;
  /* More variables in styles.css */
}
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

- **Blob** - [GitHub Profile](https://github.com/blobpetal)

## 🙏 Acknowledgments

- Inspired by classic arcade games
- Built with pixel art aesthetics in mind
- Thanks to all contributors and players!

---

⭐ Star this repository if you like it! ⭐
