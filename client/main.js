const tetrisManager = new TetrisManager(document);
const tetrisLocal = tetrisManager.createPlayer();
tetrisLocal.element.classList.add("local");
tetrisLocal.run();

const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect("ws://" + window.location.hostname + ":9000");

// 檢查 URL 中是否有房間 ID
const roomId = window.location.hash.slice(1);
if (roomId) {
  connectionManager.connect(`ws://${window.location.hostname}:9000/${roomId}`);
} else {
  // 單人模式，不需要連接
  console.log("單人模式");
}

const keyListener = (event) => {
  const player = tetrisLocal.player;

  if (event.type === "keydown") {
    switch (event.keyCode) {
      case 37: // 左箭頭
        player.move(-1);
        break;
      case 39: // 右箭頭
        player.move(1);
        break;
      case 38: // 上箭頭
        player.rotate(1);
        break;
      case 40: // 下箭頭
        if (player.dropInterval !== player.DROP_FAST) {
          player.drop();
          player.dropInterval = player.DROP_FAST;
        }
        break;
      case 32: // 空白鍵
        player.dropToBottom();
        break;
    }
  } else if (event.type === "keyup") {
    if (event.keyCode === 40) {
      // 下箭頭鍵釋放
      player.dropInterval = player.DROP_SLOW;
    }
  }
};

document.addEventListener("keydown", keyListener);
document.addEventListener("keyup", keyListener);
