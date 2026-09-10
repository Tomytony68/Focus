import { useEffect, useState } from "react";

const BUILDINGS = [
  { id: 1, name: "Árbol", icon: "🌳", price: 30 },
  { id: 2, name: "Casa", icon: "🏠", price: 100 },
  { id: 3, name: "Cafetería", icon: "☕", price: 150 },
  { id: 4, name: "Edificio", icon: "🏢", price: 300 },
  { id: 5, name: "Parque", icon: "🌲", price: 500 },
  { id: 6, name: "Universidad", icon: "🏫", price: 800 },
];

const GRID_SIZE = 36;

function App() {
  const [coins, setCoins] = useState(
    Number(localStorage.getItem("coins")) || 100
  );

  const [xp, setXp] = useState(
    Number(localStorage.getItem("xp")) || 0
  );

  const [streak, setStreak] = useState(
    Number(localStorage.getItem("streak")) || 0
  );

  const [sessions, setSessions] = useState(
    Number(localStorage.getItem("sessions")) || 0
  );

  const [totalMinutes, setTotalMinutes] = useState(
    Number(localStorage.getItem("totalMinutes")) || 0
  );

  const [buildings, setBuildings] = useState(
    JSON.parse(localStorage.getItem("buildings")) || []
  );

  const [activeTab, setActiveTab] = useState("home");

  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem("coins", coins);
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("sessions", sessions);
    localStorage.setItem("totalMinutes", totalMinutes);
    localStorage.setItem("buildings", JSON.stringify(buildings));
  }, [coins, xp, streak, sessions, totalMinutes, buildings]);

  // Temporizador
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishSession();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  const finishSession = () => {
    setIsRunning(false);

    const rewardXP = duration === 15 ? 20 : duration === 25 ? 50 : 100;
    const rewardCoins = duration === 15 ? 10 : duration === 25 ? 20 : 40;

    setXp((prev) => prev + rewardXP);
    setCoins((prev) => prev + rewardCoins);
    setSessions((prev) => prev + 1);
    setTotalMinutes((prev) => prev + duration);
    setStreak((prev) => prev + 1);

    alert(
      `🎉 ¡Sesión completada!\n\n+${rewardXP} XP\n+${rewardCoins} 🪙`
    );
  };

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration * 60);
    }

    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const changeDuration = (minutes) => {
    setDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const buyBuilding = (building) => {
    if (coins < building.price) {
      alert("❌ No tienes suficientes monedas.");
      return;
    }

    const occupiedPositions = buildings.map((b) => b.position);

    let position;

    for (let i = 0; i < GRID_SIZE; i++) {
      if (!occupiedPositions.includes(i)) {
        position = i;
        break;
      }
    }

    if (position === undefined) {
      alert("🏙️ Tu ciudad está llena.");
      return;
    }

    setCoins((prev) => prev - building.price);

    setBuildings((prev) => [
      ...prev,
      {
        id: Date.now(),
        buildingId: building.id,
        icon: building.icon,
        name: building.name,
        position,
      },
    ]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const level = Math.floor(xp / 500) + 1;

  const xpProgress = xp % 500;

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🏙️ Focus City</h1>
          <p>Construye mientras te concentras</p>
        </div>

        <div className="headerStats">
          <span>🪙 {coins}</span>
          <span>⭐ Nivel {level}</span>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav className="navigation">

        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          🏠 Inicio
        </button>

        <button
          className={activeTab === "city" ? "active" : ""}
          onClick={() => setActiveTab("city")}
        >
          🏙️ Mi ciudad
        </button>

        <button
          className={activeTab === "shop" ? "active" : ""}
          onClick={() => setActiveTab("shop")}
        >
          🛒 Tienda
        </button>

        <button
          className={activeTab === "stats" ? "active" : ""}
          onClick={() => setActiveTab("stats")}
        >
          📊 Estadísticas
        </button>

      </nav>

      <main className="content">

        {/* ================= HOME ================= */}
        {activeTab === "home" && (
          <section className="home">

            <div className="welcome">
              <h2>¡A concentrarse! 🔥</h2>
              <p>
                Completa sesiones para ganar XP y construir tu ciudad.
              </p>
            </div>

            {/* TIMER */}
            <div className="timerCard">

              <div className="timer">
                {formattedTime}
              </div>

              <p className="timerStatus">
                {isRunning
                  ? "🔥 Sesión en progreso..."
                  : "Listo para comenzar"}
              </p>

              <div className="durationButtons">

                {[15, 25, 45].map((min) => (
                  <button
                    key={min}
                    className={duration === min ? "selected" : ""}
                    onClick={() => changeDuration(min)}
                  >
                    {min} min
                  </button>
                ))}

              </div>

              <div className="timerActions">

                {!isRunning ? (
                  <button
                    className="startButton"
                    onClick={startTimer}
                  >
                    ▶ Iniciar sesión
                  </button>
                ) : (
                  <button
                    className="pauseButton"
                    onClick={pauseTimer}
                  >
                    ⏸ Pausar
                  </button>
                )}

                <button
                  className="resetButton"
                  onClick={resetTimer}
                >
                  ↻
                </button>

              </div>

            </div>

            {/* QUICK STATS */}
            <div className="quickStats">

              <div>
                <span>🔥</span>
                <strong>{streak}</strong>
                <small>Días de racha</small>
              </div>

              <div>
                <span>⭐</span>
                <strong>{xp}</strong>
                <small>XP total</small>
              </div>

              <div>
                <span>⏱️</span>
                <strong>{totalMinutes}</strong>
                <small>Minutos</small>
              </div>

              <div>
                <span>🎯</span>
                <strong>{sessions}</strong>
                <small>Sesiones</small>
              </div>

            </div>

            {/* LEVEL */}
            <div className="levelCard">

              <div className="levelHeader">
                <span>Nivel {level}</span>
                <span>{xpProgress}/500 XP</span>
              </div>

              <div className="progressBar">
                <div
                  className="progress"
                  style={{
                    width: `${(xpProgress / 500) * 100}%`,
                  }}
                />
              </div>

            </div>

          </section>
        )}

        {/* ================= CITY ================= */}
        {activeTab === "city" && (
          <section>

            <div className="sectionHeader">
              <div>
                <h2>🏙️ Mi ciudad</h2>
                <p>
                  {buildings.length} construcciones desbloqueadas
                </p>
              </div>

              <span className="coins">
                🪙 {coins}
              </span>
            </div>

            <div className="city">

              {Array.from({ length: GRID_SIZE }).map((_, index) => {

                const building = buildings.find(
                  (b) => b.position === index
                );

                return (
                  <div className="cityCell" key={index}>

                    {building && (
                      <span
                        className="cityBuilding"
                        title={building.name}
                      >
                        {building.icon}
                      </span>
                    )}

                  </div>
                );
              })}

            </div>

            {buildings.length === 0 && (
              <div className="emptyCity">
                <span>🏗️</span>
                <h3>Tu ciudad está vacía</h3>
                <p>
                  Completa sesiones y compra edificios en la tienda.
                </p>

                <button
                  onClick={() => setActiveTab("shop")}
                >
                  Ir a la tienda
                </button>
              </div>
            )}

          </section>
        )}

        {/* ================= SHOP ================= */}
        {activeTab === "shop" && (
          <section>

            <div className="sectionHeader">
              <div>
                <h2>🛒 Tienda</h2>
                <p>Usa tus monedas para construir tu ciudad.</p>
              </div>

              <span className="coins">
                🪙 {coins}
              </span>
            </div>

            <div className="shopGrid">

              {BUILDINGS.map((building) => (

                <div className="shopCard" key={building.id}>

                  <div className="buildingPreview">
                    {building.icon}
                  </div>

                  <h3>{building.name}</h3>

                  <p className="price">
                    🪙 {building.price}
                  </p>

                  <button
                    disabled={coins < building.price}
                    onClick={() => buyBuilding(building)}
                  >
                    {coins >= building.price
                      ? "Comprar"
                      : "No disponible"}
                  </button>

                </div>

              ))}

            </div>

          </section>
        )}

        {/* ================= STATS ================= */}
        {activeTab === "stats" && (
          <section>

            <div className="sectionHeader">
              <div>
                <h2>📊 Estadísticas</h2>
                <p>Tu progreso en Focus City.</p>
              </div>
            </div>

            <div className="statsGrid">

              <div className="statCard">
                <span>⭐</span>
                <strong>{xp}</strong>
                <p>XP acumulado</p>
              </div>

              <div className="statCard">
                <span>🪙</span>
                <strong>{coins}</strong>
                <p>Monedas disponibles</p>
              </div>

              <div className="statCard">
                <span>🔥</span>
                <strong>{streak}</strong>
                <p>Racha actual</p>
              </div>

              <div className="statCard">
                <span>⏱️</span>
                <strong>{totalMinutes} min</strong>
                <p>Tiempo concentrado</p>
              </div>

              <div className="statCard">
                <span>🎯</span>
                <strong>{sessions}</strong>
                <p>Sesiones completadas</p>
              </div>

              <div className="statCard">
                <span>🏗️</span>
                <strong>{buildings.length}</strong>
                <p>Construcciones</p>
              </div>

            </div>

            <div className="motivationCard">

              <span>💡</span>

              <div>
                <h3>
                  {sessions === 0
                    ? "Tu ciudad comienza aquí."
                    : "Sigue construyendo."}
                </h3>

                <p>
                  Cada minuto de concentración se convierte
                  en progreso dentro de tu ciudad.
                </p>
              </div>

            </div>

          </section>
        )}

      </main>

      {/* CSS */}
      <style>{`

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background: #f5f7fb;
          color: #172033;
        }

        button {
          font-family: inherit;
          cursor: pointer;
          border: none;
        }

        .app {
          min-height: 100vh;
        }

        /* HEADER */

        .header {
          background: white;
          padding: 25px 7%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e8ebf2;
        }

        .header h1 {
          font-size: 28px;
          margin-bottom: 5px;
        }

        .header p {
          color: #7b8497;
        }

        .headerStats {
          display: flex;
          gap: 12px;
        }

        .headerStats span,
        .coins {
          background: #f4f6fa;
          padding: 10px 15px;
          border-radius: 12px;
          font-weight: 700;
        }

        /* NAVIGATION */

        .navigation {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          background: white;
          border-bottom: 1px solid #e8ebf2;
        }

        .navigation button {
          background: transparent;
          padding: 10px 18px;
          border-radius: 10px;
          color: #697386;
          font-weight: 600;
        }

        .navigation button:hover {
          background: #f2f4f8;
        }

        .navigation button.active {
          background: #172033;
          color: white;
        }

        /* CONTENT */

        .content {
          max-width: 1100px;
          margin: auto;
          padding: 45px 25px;
        }

        .welcome {
          margin-bottom: 30px;
        }

        .welcome h2 {
          font-size: 30px;
          margin-bottom: 8px;
        }

        .welcome p,
        .sectionHeader p {
          color: #7b8497;
        }

        /* TIMER */

        .timerCard {
          background: white;
          border-radius: 25px;
          padding: 45px;
          text-align: center;
          box-shadow: 0 10px 35px rgba(20, 30, 50, .06);
        }

        .timer {
          font-size: 80px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .timerStatus {
          color: #7b8497;
          margin: 10px 0 25px;
        }

        .durationButtons {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 25px;
        }

        .durationButtons button {
          padding: 10px 18px;
          border-radius: 10px;
          background: #f1f3f7;
          color: #555e70;
          font-weight: 600;
        }

        .durationButtons button.selected {
          background: #172033;
          color: white;
        }

        .timerActions {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .startButton,
        .pauseButton {
          padding: 15px 30px;
          border-radius: 12px;
          background: #172033;
          color: white;
          font-size: 16px;
          font-weight: 700;
        }

        .pauseButton {
          background: #c0392b;
        }

        .resetButton {
          width: 50px;
          border-radius: 12px;
          background: #edf0f5;
          font-size: 20px;
        }

        /* QUICK STATS */

        .quickStats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          margin-top: 20px;
        }

        .quickStats > div {
          background: white;
          border-radius: 18px;
          padding: 20px;
          text-align: center;
        }

        .quickStats span {
          display: block;
          font-size: 25px;
          margin-bottom: 7px;
        }

        .quickStats strong {
          display: block;
          font-size: 23px;
        }

        .quickStats small {
          color: #7b8497;
        }

        /* LEVEL */

        .levelCard {
          background: white;
          margin-top: 20px;
          padding: 20px;
          border-radius: 18px;
        }

        .levelHeader {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .progressBar {
          height: 10px;
          background: #edf0f5;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress {
          height: 100%;
          background: #172033;
          border-radius: 10px;
          transition: width .4s;
        }

        /* SECTION */

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .sectionHeader h2 {
          font-size: 30px;
          margin-bottom: 5px;
        }

        /* CITY */

        .city {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 5px;
          background: #c8d8c0;
          padding: 15px;
          border-radius: 25px;
          min-height: 450px;
        }

        .cityCell {
          background: rgba(255,255,255,.25);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 65px;
        }

        .cityBuilding {
          font-size: 42px;
          animation: appear .3s ease;
        }

        @keyframes appear {
          from {
            transform: scale(.5);
            opacity: 0;
          }

          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .emptyCity {
          text-align: center;
          margin-top: 25px;
          background: white;
          padding: 30px;
          border-radius: 20px;
        }

        .emptyCity span {
          font-size: 40px;
        }

        .emptyCity h3 {
          margin: 10px 0;
        }

        .emptyCity p {
          color: #7b8497;
          margin-bottom: 15px;
        }

        .emptyCity button {
          padding: 12px 20px;
          border-radius: 10px;
          background: #172033;
          color: white;
          font-weight: 700;
        }

        /* SHOP */

        .shopGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .shopCard {
          background: white;
          padding: 25px;
          border-radius: 20px;
          text-align: center;
        }

        .buildingPreview {
          font-size: 65px;
          margin-bottom: 10px;
        }

        .shopCard h3 {
          margin-bottom: 8px;
        }

        .price {
          font-weight: 700;
          margin-bottom: 15px;
        }

        .shopCard button {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          background: #172033;
          color: white;
          font-weight: 700;
        }

        .shopCard button:disabled {
          background: #dfe3ea;
          color: #8a92a2;
          cursor: not-allowed;
        }

        /* STATS */

        .statsGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .statCard {
          background: white;
          border-radius: 20px;
          padding: 25px;
        }

        .statCard span {
          font-size: 30px;
        }

        .statCard strong {
          display: block;
          font-size: 30px;
          margin-top: 10px;
        }

        .statCard p {
          color: #7b8497;
          margin-top: 5px;
        }

        .motivationCard {
          background: #172033;
          color: white;
          margin-top: 20px;
          padding: 25px;
          border-radius: 20px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .motivationCard > span {
          font-size: 35px;
        }

        .motivationCard p {
          color: #b9c0cd;
          margin-top: 5px;
        }

        /* RESPONSIVE */

        @media (max-width: 750px) {

          .header {
            padding: 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .headerStats {
            width: 100%;
          }

          .headerStats span {
            flex: 1;
          }

          .navigation {
            overflow-x: auto;
            justify-content: flex-start;
          }

          .content {
            padding: 30px 15px;
          }

          .timerCard {
            padding: 30px 15px;
          }

          .timer {
            font-size: 55px;
          }

          .quickStats {
            grid-template-columns: repeat(2, 1fr);
          }

          .shopGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .statsGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .city {
            grid-template-columns: repeat(4, 1fr);
          }

        }

        @media (max-width: 450px) {

          .shopGrid,
          .statsGrid {
            grid-template-columns: 1fr;
          }

          .timer {
            font-size: 45px;
          }

          .cityBuilding {
            font-size: 30px;
          }

        }

      `}</style>

    </div>
  );
}

export default App;