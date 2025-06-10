/**
 * BallGame - A pixel art style ball clicking game with power-ups and combos
 * @class BallGame
 */
class BallGame {
  /**
   * Initialize the game with all necessary properties and event listeners
   */
  constructor() {
    // Theme & DOM setup
    this.themeSwitch = document.getElementById("themeSwitch");
    this.gameArea = document.getElementById("gameArea");
    this.scoreElement = document.getElementById("score");
    this.timeElement = document.getElementById("time");
    this.startButton = document.getElementById("startButton");
    this.restartButton = document.getElementById("restartButton");
    this.gameOverScreen = document.getElementById("gameOver");
    this.finalScoreElement = document.getElementById("finalScore");
    this.instructionsButton = document.getElementById("instructionsButton");
    this.instructions = document.getElementById("instructions");
    this.closeInstructions = document.getElementById("closeInstructions");
    this.highScoreElement = document.getElementById("highScore");
    this.bestComboElement = document.getElementById("bestCombo");
    this.comboElement = document.getElementById("combo");
    this.finalComboElement = document.getElementById("finalCombo");

    // Game state
    this.score = this.combo = this.timeLeft = 0;
    this.gameInterval = this.ballInterval = null;
    this.isPlaying = false;
    this.balls = new Set();
    this.maxBalls = 5;
    this.lastClickTime = 0;
    this.activePowerUps = new Set();
    this.highScore = parseInt(localStorage.getItem("highScore")) || 0;
    this.bestCombo = parseInt(localStorage.getItem("bestCombo")) || 0;

    // Initialize game
    this.setupTheme();
    this.setupEventListeners();
    this.initializeDisplay();
  }

  /**
   * Set up all event listeners for the game
   */
  setupEventListeners() {
    // Game controls
    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.startGame());
    this.instructionsButton.addEventListener("click", () =>
      this.showInstructions()
    );
    this.closeInstructions.addEventListener("click", () =>
      this.hideInstructions()
    );

    // Instructions handling
    this.instructions.addEventListener("click", (e) => {
      if (e.target === this.instructions) this.hideInstructions();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.instructions.style.display === "flex") {
        this.hideInstructions();
      }
    });

    // Cursor tracking
    this.gameArea.addEventListener("mousemove", (e) => {
      const rect = this.gameArea.getBoundingClientRect();
      this.gameArea.style.setProperty(
        "--cursor-x",
        `${e.clientX - rect.left}px`
      );
      this.gameArea.style.setProperty(
        "--cursor-y",
        `${e.clientY - rect.top}px`
      );
      this.gameArea.style.setProperty("--cursor-opacity", "1");
    });
    this.gameArea.addEventListener("mouseleave", () =>
      this.gameArea.style.setProperty("--cursor-opacity", "0")
    );
    this.gameArea.addEventListener("mouseenter", () =>
      this.gameArea.style.setProperty("--cursor-opacity", "1")
    );
  }

  /**
   * Set up theme switching functionality
   */
  setupTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);

    this.themeSwitch.addEventListener("click", () => {
      const newTheme =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      this.updateThemeIcon(newTheme);
    });
  }

  /**
   * Update the theme switch icon based on current theme
   * @param {string} theme - Current theme ('light' or 'dark')
   */
  updateThemeIcon(theme) {
    this.themeSwitch.querySelector("i").className =
      theme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  /**
   * Initialize the game display and load saved data
   */
  initializeDisplay() {
    this.highScoreElement.textContent = this.highScore;
    this.bestComboElement.textContent = this.bestCombo;
    this.instructions.style.display = "none";
    this.gameOverScreen.style.display = "none";
    this.gameArea.style.setProperty("--cursor-x", "0px");
    this.gameArea.style.setProperty("--cursor-y", "0px");
    this.gameArea.style.setProperty("--cursor-opacity", "0");
  }

  /**
   * Show the game instructions modal
   */
  showInstructions() {
    this.instructions.style.display = "flex";
    document.body.style.overflow = "hidden";
    this.isPlaying = false;
  }

  /**
   * Hide the game instructions modal
   */
  hideInstructions() {
    this.instructions.style.display = "none";
    document.body.style.overflow = "";
    if (this.timeLeft > 0 && this.score > 0) this.isPlaying = true;
  }

  /**
   * Start a new game
   */
  startGame() {
    if (this.isPlaying) return;

    // Only scroll on mobile devices
    if (window.innerWidth <= 768) {
      this.gameArea.scrollIntoView({ behavior: "smooth" });
    }

    // Reset game state
    this.isPlaying = true;
    this.score = this.combo = 0;
    this.timeLeft = 30;
    this.balls.clear();
    this.activePowerUps.clear();

    // Update UI
    this.scoreElement.textContent = this.score;
    this.comboElement.textContent = this.combo;
    this.timeElement.textContent = this.timeLeft;
    this.startButton.disabled = true;
    this.startButton.style.opacity = "0.5";
    this.startButton.style.cursor = "not-allowed";
    this.startButton.innerHTML = '<i class="fas fa-play"></i> Game Running';
    this.gameOverScreen.style.display = "none";

    // Clear and start intervals
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.ballInterval) clearInterval(this.ballInterval);

    this.gameInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.timeElement.textContent = this.timeLeft;
      } else {
        this.endGame();
      }
    }, 1000);

    this.ballInterval = setInterval(() => {
      if (this.isPlaying && this.balls.size < this.maxBalls) {
        this.createBall();
      }
    }, 1500);

    // Create initial balls
    for (let i = 0; i < 3; i++) this.createBall();
  }

  createBall() {
    const ball = document.createElement("div");
    ball.className = "ball";

    const ballTypes = [
      {
        type: "normal",
        size: [40, 70],
        points: 3,
        color: "#FF6B6B",
        probability: 0.5,
        icon: "circle",
      },
      {
        type: "small",
        size: [20, 35],
        points: 5,
        color: "#4ECDC4",
        probability: 0.15,
        icon: "bolt",
      },
      {
        type: "large",
        size: [70, 100],
        points: 1,
        color: "#45B7D1",
        probability: 0.15,
        icon: null,
      },
      {
        type: "timeFreeze",
        size: [50, 60],
        points: 0,
        color: "#9B59B6",
        probability: 0.1,
        icon: "clock",
      },
      {
        type: "strike",
        size: [50, 60],
        points: 0,
        color: "#FFA500",
        probability: 0.05,
        icon: "arrow-down",
      },
      {
        type: "bomb",
        size: [50, 60],
        points: 0,
        color: "#FF0000",
        probability: 0.05,
        icon: "bomb",
      },
    ];

    // Select ball type based on probability
    const rand = Math.random();
    let cumulativeProbability = 0;
    let selectedType;

    for (const type of ballTypes) {
      cumulativeProbability += type.probability;
      if (rand <= cumulativeProbability) {
        selectedType = type;
        break;
      }
    }

    const size =
      Math.floor(
        Math.random() * (selectedType.size[1] - selectedType.size[0])
      ) + selectedType.size[0];
    ball.style.width = `${size}px`;
    ball.style.height = `${size}px`;

    const padding = 10;
    const maxX = this.gameArea.clientWidth - size - padding;
    const maxY = this.gameArea.clientHeight - size - padding;

    const posX = Math.max(padding, Math.random() * maxX);
    const posY = Math.max(padding, Math.random() * maxY);

    ball.style.left = `${posX}px`;
    ball.style.top = `${posY}px`;

    if (this.checkBallOverlap(posX, posY, size)) {
      ball.remove();
      return;
    }

    // Set ball properties
    ball.dataset.type = selectedType.type;
    ball.dataset.points = selectedType.points;
    ball.style.backgroundColor = selectedType.color;
    ball.style.boxShadow = `0 0 20px ${selectedType.color}80`;

    // Add icon and special effects based on ball type
    if (selectedType.type !== "normal") {
      ball.style.animation = "pulse 1s infinite";
      ball.innerHTML = `<i class="fas fa-${selectedType.icon}"></i>`;
      ball.style.fontSize = `${size / 2}px`;
      ball.style.display = "flex";
      ball.style.alignItems = "center";
      ball.style.justifyContent = "center";

      // Add special effects for different types
      if (selectedType.type === "small") {
        ball.style.animation = "pulse 0.8s infinite";
      } else if (selectedType.type === "large") {
        ball.style.animation = "slowPulse 1.5s infinite";
      } else if (selectedType.type === "timeFreeze") {
        ball.style.border = "2px solid #fff";
      } else if (selectedType.type === "strike") {
        ball.style.background = "linear-gradient(45deg, #FFA500, #FFA500)";
      } else if (selectedType.type === "bomb") {
        ball.style.background = "linear-gradient(45deg, #FF0000, #FF0000)";
      }
    }

    ball.addEventListener("click", () => {
      if (this.isPlaying) {
        const now = Date.now();
        const timeSinceLastClick = now - this.lastClickTime;

        if (timeSinceLastClick < 1000) {
          this.combo++;
          if (this.combo > this.bestCombo) {
            this.bestCombo = this.combo;
            this.bestComboElement.textContent = this.bestCombo;
            localStorage.setItem("bestCombo", this.bestCombo);
          }
        } else {
          this.combo = 1;
        }
        this.lastClickTime = now;
        this.comboElement.textContent = this.combo;

        let points = selectedType.points;
        if (
          selectedType.type !== "normal" &&
          selectedType.type !== "small" &&
          selectedType.type !== "large"
        ) {
          this.activatePowerUp(selectedType.type);
          points = 0; // Special balls don't give points
        }

        const comboMultiplier = Math.min(3, 1 + this.combo * 0.2);
        const finalPoints = Math.floor(points * comboMultiplier);

        this.score += finalPoints;
        this.scoreElement.textContent = this.score;

        this.createPointsPopup(posX, posY, finalPoints, this.combo > 1);

        this.balls.delete(ball);
        ball.remove();

        setTimeout(() => {
          if (this.isPlaying && this.balls.size < this.maxBalls) {
            this.createBall();
          }
        }, 300);
      }
    });

    this.gameArea.appendChild(ball);
    this.balls.add(ball);

    // Remove ball after 3 seconds if not clicked
    setTimeout(() => {
      if (this.balls.has(ball)) {
        this.balls.delete(ball);
        ball.remove();
      }
    }, 3000);
  }

  createPointsPopup(x, y, points, isCombo = false) {
    if (points === 0) return; // Don't create popup for zero points

    const popup = document.createElement("div");
    popup.className = "points-popup";
    popup.textContent = `${isCombo ? "COMBO! " : ""}+${points}`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    this.gameArea.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 500);
  }

  activatePowerUp(powerUpType) {
    const powerUps = {
      timeFreeze: {
        name: "+3 Seconds",
        duration: 5000,
        effect: () => {
          this.timeLeft += 3;
          this.timeElement.textContent = this.timeLeft;
        },
        icon: "clock",
      },
      strike: {
        name: "Strike!",
        duration: 2000,
        effect: () => {
          const gameWidth = this.gameArea.clientWidth;
          const gameHeight = this.gameArea.clientHeight;
          const arrowSpacing = 60; // Increased spacing to reduce arrow count
          const columns = Math.ceil(gameWidth / arrowSpacing);
          const rows = Math.ceil(gameHeight / arrowSpacing);
          const maxArrows = 50; // Limit total number of arrows
          let arrowCount = 0;

          // Create continuous rain of arrows
          const createArrow = (x, y, delay) => {
            if (arrowCount >= maxArrows) return; // Stop creating arrows if limit reached
            arrowCount++;

            const arrow = document.createElement("div");
            arrow.className = "strike-arrow";
            arrow.innerHTML = '<i class="fas fa-arrow-down"></i>';
            arrow.style.left = `${x}px`;
            arrow.style.top = `${y}px`;
            arrow.style.animationDelay = `${delay}ms`;
            this.gameArea.appendChild(arrow);

            // Remove arrow after animation
            setTimeout(() => {
              arrow.remove();
              arrowCount--;
            }, 2000);
          };

          // Create a single wave of arrows with random positions
          for (let i = 0; i < maxArrows; i++) {
            const x = Math.random() * gameWidth;
            const y = -100 - Math.random() * gameHeight;
            const delay = Math.random() * 500;
            createArrow(x, y, delay);
          }

          // Collect points from all non-bomb balls
          setTimeout(() => {
            this.balls.forEach((ball) => {
              if (ball.dataset.type !== "bomb") {
                // Handle time freeze balls separately
                if (ball.dataset.type === "timeFreeze") {
                  this.timeLeft += 3;
                  this.timeElement.textContent = this.timeLeft;
                } else {
                  const points = parseInt(ball.dataset.points);
                  const comboMultiplier = Math.min(3, 1 + this.combo * 0.2);
                  const finalPoints = Math.floor(points * comboMultiplier);
                  this.score += finalPoints;
                  this.scoreElement.textContent = this.score;
                  this.createPointsPopup(
                    parseInt(ball.style.left),
                    parseInt(ball.style.top),
                    finalPoints,
                    this.combo > 1
                  );
                }
                this.balls.delete(ball);
                ball.remove();
              }
            });
          }, 1000);
        },
        icon: "arrow-down",
      },
      bomb: {
        name: "-5 Seconds",
        duration: 0,
        effect: () => {
          this.timeLeft = Math.max(0, this.timeLeft - 5);
          this.timeElement.textContent = this.timeLeft;
          if (this.timeLeft <= 0) {
            this.endGame();
          }
        },
        icon: "bomb",
      },
    };

    const powerUp = powerUps[powerUpType];
    if (!powerUp) return;

    this.activePowerUps.add(powerUpType);
    powerUp.effect();

    const notification = document.createElement("div");
    notification.className = "powerup-notification";
    notification.innerHTML = `<i class="fas fa-${powerUp.icon}"></i> ${powerUp.name}`;
    this.gameArea.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);

    if (powerUp.duration > 0) {
      setTimeout(() => {
        this.activePowerUps.delete(powerUpType);
      }, powerUp.duration);
    }
  }

  checkBallOverlap(x, y, size) {
    const padding = 20;
    for (const ball of this.balls) {
      const ballRect = ball.getBoundingClientRect();
      const gameAreaRect = this.gameArea.getBoundingClientRect();

      const ballX = ballRect.left - gameAreaRect.left;
      const ballY = ballRect.top - gameAreaRect.top;
      const ballSize = ballRect.width;

      if (
        Math.abs(x - ballX) < (size + ballSize) / 2 + padding &&
        Math.abs(y - ballY) < (size + ballSize) / 2 + padding
      ) {
        return true;
      }
    }
    return false;
  }

  endGame() {
    this.isPlaying = false;
    clearInterval(this.gameInterval);
    clearInterval(this.ballInterval);

    this.balls.forEach((ball) => ball.remove());
    this.balls.clear();

    this.gameArea.innerHTML = "";
    this.finalScoreElement.textContent = this.score;
    this.finalComboElement.textContent = this.combo;

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.highScoreElement.textContent = this.highScore;
      localStorage.setItem("highScore", this.highScore);
    }

    this.gameOverScreen.style.display = "block";

    this.startButton.disabled = false;
    this.startButton.style.opacity = "1";
    this.startButton.style.cursor = "pointer";
    this.startButton.innerHTML = '<i class="fas fa-play"></i> Start Game';
  }
}

// Initialize the game when the page loads
window.addEventListener("load", () => {
  new BallGame();
});
