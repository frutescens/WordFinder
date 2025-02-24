const startGame = async (manifest?: any) => {
  try {
    const { game } = await import("./game");
    game.sound.pauseOnBlur = false;

    if (manifest) {
      game["manifest"] = manifest;
    }
  } catch (err) {
    console.error("Game failed to launch:", err);
  }
};

fetch("/manifest.json")
  .then((res) => res.json())
  .then((jsonResponse) => {
    startGame(jsonResponse.manifest);
  })
  .catch(() => {
    // Manifest not found (likely local build)
    startGame();
  });
