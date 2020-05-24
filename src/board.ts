import { Color, colorInv } from "./color";
import { GameResult } from "./gameResult";
import { Move } from "./move";

export class Board {
  private board: Color[][];
  turn: Color;
  gameResult: GameResult;

  constructor() {
    this.board = new Array<Color[]>(8);
    for (let y = 0; y < 8; y++) {
      this.board[y] = new Array<Color>(8);
      for (let x = 0; x < 8; x++) {
        this.board[y][x] = Color.None;
      }
    }
    this.board[3][4] = Color.Black;
    this.board[4][3] = Color.Black;
    this.board[3][3] = Color.White;
    this.board[4][4] = Color.White;
    this.turn = Color.Black;
    this.gameResult = GameResult.Playing;
  }

  /** 複製 */
  clone(): Board {
    const b = new Board();
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        b.board[y][x] = this.board[y][x];
      }
    }
    b.turn = this.turn;
    b.gameResult = this.gameResult;
    return b;
  }

  getColor(x: number, y: number): Color {
    return this.board[y][x];
  }

  checkBound(x: number, y: number): boolean {
    return 0 <= x && x < 8 && 0 <= y && y < 8;
  }

  /** (x, y)に駒を置いた時にひっくり返る駒を返す
      空だったらそのマスには置けないということ */
  private flipCells(x: number, y: number): Move[] {
    const cells: [number, number][] = [];
    if (this.board[y][x] !== Color.None) return cells;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        let nx = x + dx;
        let ny = y + dy;

        // 範囲外の場合
        if (!this.checkBound(nx, ny)) continue;
        // 隣が相手の色でない場合
        if (this.getColor(nx, ny) !== colorInv(this.turn)) continue;

        const cellsOneDirection: [number, number][] = [];
        while (true) {
          if (!this.checkBound(nx, ny)) {
            break;
          }
          // 空白だったら失敗
          if (this.getColor(nx, ny) === Color.None) {
            break;
          }
          // 自分の色にぶつかったら成功
          if (this.getColor(nx, ny) === this.turn) {
            cells.push(...cellsOneDirection);
            break;
          }
          // 相手の色なら続行
          cellsOneDirection.push([nx, ny]);
          nx += dx;
          ny += dy;
        }
        cells.concat(cellsOneDirection);
      }
    }
    return cells;
  }

  /** 合法手を返す */
  legalMoves(): Move[] {
    const legalMoves: Move[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (this.flipCells(x, y).length > 0) {
          legalMoves.push([x, y]);
        }
      }
    }
    return legalMoves;
  }

  /** 駒を置く
      合法手でない場合はfalseを返す */
  put(x: number, y: number, color: Color = this.turn): boolean {
    if (!this.checkBound(x, y)) {
      return false;
    }
    if (this.board[y][x] !== Color.None) {
      return false;
    }
    const cells = this.flipCells(x, y);
    if (cells.length === 0) {
      return false;
    }
    this.board[y][x] = color;
    cells.forEach(([x, y]) => (this.board[y][x] = this.turn));
    this.turn = colorInv(this.turn);

    // パスをする
    if (this.passIfNeeded() && this.passIfNeeded()) {
      // 2連続なら試合終了
      const [black, white] = this.score();
      if (black > white) {
        this.gameResult = GameResult.BlackWin;
      } else if (black < white) {
        this.gameResult = GameResult.WhiteWin;
      } else {
        this.gameResult = GameResult.Draw;
      }
    }
    return true;
  }

  /** 必要であればパスをしtrueを返す */
  passIfNeeded() {
    const moves = this.legalMoves();
    if (moves.length === 0) {
      this.turn = colorInv(this.turn);
      return true;
    }
    return false;
  }

  /** [黒石の数, 白石の数]を返す */
  score(): [number, number] {
    let black = 0;
    let white = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        switch (this.getColor(x, y)) {
          case Color.None:
            break;
          case Color.Black:
            black++;
            break;
          case Color.White:
            white++;
            break;
        }
      }
    }
    return [black, white];
  }

  isGameOver(): boolean {
    return this.gameResult !== GameResult.Playing;
  }
}
