
const mineflayer = require("mineflayer");

const HOST = process.env.MC_HOST;
const PORT = Number(process.env.MC_PORT || 25565);
const USERNAME = process.env.MC_USERNAME || "ServerTestBot";
const VERSION = process.env.MC_VERSION || false;

if (!HOST) {
  console.error("ERROR: Set the MC_HOST environment variable.");
  process.exit(1);
}

const bot = mineflayer.createBot({
  host: HOST,
  port: PORT,
  username: USERNAME,
  ...(VERSION ? { version: VERSION } : {})
});

let movementTimer;

bot.once("login", () => {
  console.log("Bot logged in.");
});

bot.once("spawn", () => {
  console.log("Bot spawned. Starting small movements.");

  const directions = [
    ["forward"],
    ["back"],
    ["left"],
    ["right"],
    []
  ];

  let index = 0;

  movementTimer = setInterval(() => {
    if (!bot.entity) return;

    bot.clearControlStates();

    const controls = directions[index];
    for (const control of controls) {
      bot.setControlState(control, true);
    }

    console.log(
      "Movement:",
      controls.length ? controls.join(" + ") : "standing still"
    );

    index = (index + 1) % directions.length;
  }, 1500);
});

bot.on("kicked", (reason) => {
  console.log("Kicked:", reason);
});

bot.on("error", (error) => {
  console.error("Connection error:", error.message);
});

bot.on("end", (reason) => {
  clearInterval(movementTimer);
  console.log("Disconnected:", reason);
});

process.on("SIGTERM", () => {
  clearInterval(movementTimer);
  bot.quit("Worker shutting down");
});
