import { Color, colorToString } from "./color";
import { Board } from "./board";
import { gameResultToString } from "./gameResult";
import { Ai } from "./ai";

const HEIGHT = 320;
const WIDTH = 320;
const CELL_SIZE = 40;

class App {
  private board: Board;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private playerTurn: Color;

  constructor() {
    this.board = new Board();
    this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d")!;
    this.playerTurn = Math.random() > 0.5 ? Color.Black : Color.White;

    this.canvas.addEventListener("mousedown", (e) => this.put(e));
  }

  private put(e: MouseEvent) {
    if (e.button !== 0) {
      return;
    }
    if (this.board.turn !== this.playerTurn) {
      return;
    }

    const x = Math.floor(e.offsetX / CELL_SIZE);
    const y = Math.floor(e.offsetY / CELL_SIZE);
    this.board.put(x, y);
    this.update();
  }

  private aiMove() {
    const [x, y] = Ai.search(this.board);
    this.board.put(x, y);
  }

  private drawBoard() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    this.ctx.fillStyle = "lightgreen";
    this.ctx.fillRect(0, 0, 320, 320);

    this.ctx.strokeStyle = "black";
    this.ctx.beginPath();
    for (let y = 0; y <= 8; y++) {
      this.ctx.moveTo(0, y * CELL_SIZE);
      this.ctx.lineTo(WIDTH, y * CELL_SIZE);
    }
    for (let x = 0; x <= 8; x++) {
      this.ctx.moveTo(x * CELL_SIZE, 0);
      this.ctx.lineTo(x * CELL_SIZE, HEIGHT);
    }
    this.ctx.stroke();

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const cx = x * CELL_SIZE + CELL_SIZE / 2;
        const cy = y * CELL_SIZE + CELL_SIZE / 2;
        switch (this.board.getColor(x, y)) {
          case Color.None:
            break;
          case Color.Black:
            this.ctx.beginPath();
            this.ctx.fillStyle = "black";
            this.ctx.arc(cx, cy, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
            this.ctx.fill();
            break;
          case Color.White:
            this.ctx.beginPath();
            this.ctx.fillStyle = "white";
            this.ctx.arc(cx, cy, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
            this.ctx.fill();
            break;
        }
      }
    }
  }

  /** 盤面の描画とゲームの情報を更新する */
  update() {
    this.drawBoard();
    document.getElementById("turn")!.innerHTML = `手番: ${colorToString(
      this.board.turn
    )}(${this.board.turn === this.playerTurn ? "あなた" : "AI"})`;
    const [black, white] = this.board.score();
    document.getElementById(
      "score"
    )!.innerHTML = `スコア: (${black}, ${white})`;
    document.getElementById(
      "gameResult"
    )!.innerHTML = `試合結果: ${gameResultToString(this.board.gameResult)}`;

    if (!this.board.isGameOver() && this.board.turn !== this.playerTurn) {
      this.aiMove();
      this.update();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const app = new App();
  app.update();
});
