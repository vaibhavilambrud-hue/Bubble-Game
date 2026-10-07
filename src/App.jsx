import { useEffect, useState } from "react";
import "./App.css";

const BUBBLE_COUNT = 30;
const GAME_TIME = 30;

function createBubble(id, position = null) {
  return {
    id,
    number: Math.floor(Math.random() * 10) + 1,

    size: Math.floor(Math.random() * 25) + 60,

    left: position ? position.left : Math.random() * 90 + 5,
    top: position ? position.top : Math.random() * 80 + 10,

    delay: Math.random() * 2,
    duration: Math.random() * 2 + 3,
  };
}

function generateBubbles() {
  const bubbles = [];

 const columns = 6;
  const rows = 5;

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const id = row * columns + column;

      const baseLeft = ((column + 0.5) / columns) * 100;
      const baseTop = ((row + 0.5) / rows) * 100;

      const randomLeft = (Math.random() - 0.5) * 7;
      const randomTop = (Math.random() - 0.5) * 7;

      const left = Math.max(
        5,
        Math.min(95, baseLeft + randomLeft)
      );

      const top = Math.max(
        8,
        Math.min(92, baseTop + randomTop)
      );

      bubbles.push(
        createBubble(id, {
          left,
          top,
        })
      );
    }
  }

  return bubbles;
}

function generateNewBubble(existingBubbles) {
  const columns = 6;
  const rows = 5;


  const usedCells = existingBubbles.map((bubble) => {
    const column = Math.floor((bubble.left / 100) * columns);
    const row = Math.floor((bubble.top / 100) * rows);

    return `${column}-${row}`;
  });

  const availableCells = [];

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const cell = `${column}-${row}`;

      if (!usedCells.includes(cell)) {
        availableCells.push({
          column,
          row,
        });
      }
    }
  }

  if (availableCells.length === 0) {
    return null;
  }

  const randomCell =
    availableCells[
      Math.floor(Math.random() * availableCells.length)
    ];

  const baseLeft =
    ((randomCell.column + 0.5) / columns) * 100;

  const baseTop =
    ((randomCell.row + 0.5) / rows) * 100;

  const left = Math.max(
    5,
    Math.min(
      95,
      baseLeft + (Math.random() - 0.5) * 6
    )
  );

  const top = Math.max(
    8,
    Math.min(
      92,
      baseTop + (Math.random() - 0.5) * 6
    )
  );

  return createBubble(Date.now(), {
    left,
    top,
  });
}

function App() {
  const [bubbles, setBubbles] = useState([]);
  const [target, setTarget] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(GAME_TIME);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [gameOver, setGameOver] =
    useState(false);

  const [popped, setPopped] = useState([]);


  const createTarget = () => {
    setTarget(
      Math.floor(Math.random() * 10) + 1
    );
  };


  const startGame = () => {
    setScore(0);
    setTime(GAME_TIME);
    setGameOver(false);
    setGameStarted(true);
    setPopped([]);

    setBubbles(generateBubbles());

    createTarget();
  };


  useEffect(() => {
    if (!gameStarted || gameOver) {
      return;
    }

    if (time <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setInterval(() => {
      setTime((previousTime) =>
        previousTime - 1
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [
    gameStarted,
    gameOver,
    time,
  ]);


  const handleBubbleClick = (bubble) => {
    if (
      !gameStarted ||
      gameOver ||
      popped.includes(bubble.id)
    ) {
      return;
    }


    if (bubble.number === target) {
      setScore(
        (previousScore) =>
          previousScore + 10
      );

      setPopped((previous) => [
        ...previous,
        bubble.id,
      ]);

      setTimeout(() => {
        createTarget();
      }, 150);

      setTimeout(() => {
        setBubbles((previousBubbles) => {
          const newBubble =
            generateNewBubble(
              previousBubbles
            );

          if (!newBubble) {
            return previousBubbles;
          }

          return [
            ...previousBubbles,
            newBubble,
          ];
        });
      }, 300);
    }


    else {
      setScore(
        (previousScore) =>
          Math.max(
            0,
            previousScore - 5
          )
      );

      setTime(
        (previousTime) =>
          Math.max(
            0,
            previousTime - 2
          )
      );
    }
  };

  return (
    <div className="game-page">


      <header className="game-header">

        <div className="logo">
          <span className="logo-bubble">
            🫧
          </span>

          <span>
            Bubble Pop
          </span>
        </div>

        {gameStarted && (
          <button
            className="restart-button"
            onClick={startGame}
          >
            Restart
          </button>
        )}

      </header>


      {!gameStarted ? (
        <div className="start-screen">

          <div className="start-card">

            <div className="big-bubble">
              🫧
            </div>

            <h1>
              Bubble Game
            </h1>

            <p>
              Find and pop the bubbles
              containing the target number.
              <br />
              Be quick before the timer
              runs out!
            </p>

            <div className="instructions">

              <div>
                <span>🎯</span>

                <p>
                  <strong>
                    Find
                  </strong>

                  <br />

                  Target number
                </p>
              </div>

              <div>
                <span>🫧</span>

                <p>
                  <strong>
                    Pop
                  </strong>

                  <br />

                  Correct bubble
                </p>
              </div>

              <div>
                <span>🏆</span>

                <p>
                  <strong>
                    Score
                  </strong>

                  <br />

                  +10 points
                </p>
              </div>

            </div>

            <button
              className="start-button"
              onClick={startGame}
            >
              Start Game
            </button>

          </div>

        </div>
      ) : (

        <>

          <section className="score-board">

            <div className="info-box">

              <span className="info-label">
                SCORE
              </span>

              <span className="info-value">
                {score}
              </span>

            </div>

            <div className="target-box">

              <span className="target-label">
                POP NUMBER
              </span>

              <span className="target-number">
                {target}
              </span>

            </div>

            <div className="info-box">

              <span className="info-label">
                TIME
              </span>

              <span className="info-value">
                {time}s
              </span>

            </div>

          </section>


          <main className="game-area">

            {bubbles.map((bubble) => (

              <button
                key={bubble.id}
                className={`bubble ${
                  popped.includes(
                    bubble.id
                  )
                    ? "bubble-popped"
                    : ""
                }`}
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: `${bubble.left}%`,
                  top: `${bubble.top}%`,
                  animationDelay: `${bubble.delay}s`,
                  animationDuration: `${bubble.duration}s`,
                }}
                onClick={() =>
                  handleBubbleClick(
                    bubble
                  )
                }
              >
                {bubble.number}
              </button>

            ))}


            {gameOver && (

              <div className="game-over-overlay">

                <div className="game-over-card">

                  <div className="game-over-icon">
                    🏆
                  </div>

                  <h2>
                    Game Over!
                  </h2>

                  <p>
                    Your final score
                  </p>

                  <div className="final-score">
                    {score}
                  </div>

                  <button
                    className="start-button"
                    onClick={startGame}
                  >
                    Play Again
                  </button>

                </div>

              </div>

            )}

          </main>
        </>
      )}

    </div>
  );
}

export default App;