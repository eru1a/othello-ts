import { Board } from "./board";
import { Color } from "./color";
import { Move } from "./move";

// 石の位置による評価
// https://uguisu.skr.jp/othello/5-1.html
const stoneValues: number[][] = [
  [30, -12, 0, -1, -1, 0, -12, 30],
  [-12, -15, -3, -3, -3, -3, -15, -12],
  [0, -3, 0, -1, -1, 0, -3, 0],
  [-1, -3, -1, -1, -1, -1, -3, -1],
  [-1, -3, -1, -1, -1, -1, -3, -1],
  [0, -3, 0, -1, -1, 0, -3, 0],
  [-12, -15, -3, -3, -3, -3, -15, -12],
  [30, -12, 0, -1, -1, 0, -12, 30],
];

type Score = {
  move: Move;
  score: number;
};

export class Ai {
  static search(board: Board): Move {
    const s = this.minmax(board, board.turn, 3);
    return s.move;
  }

  private static minmax(board: Board, turn: Color, depth: number): Score {
    if (board.isGameOver() || depth === 0) {
      const score = this.eval(board, turn);
      const move: Move = [-1, -1];
      return { move, score };
    }
    const moveAndScores: Score[] = board
      .legalMoves()
      .map((move) => {
        const [x, y] = move;
        const boardClone = board.clone();
        boardClone.put(x, y);
        const score = this.minmax(boardClone, turn, depth - 1).score;
        return { move, score };
      })
      .sort((score1, score2) =>
        board.turn === turn
          ? // 自分の手番の時は大きい順に
            -(score1.score - score2.score)
          : // 相手の手番の時は小さい順に
            score1.score - score2.score
      );
    // console.log(turn === board.turn, moveAndScores.map((s) => s.score));
    return moveAndScores[0];
  }

  /** turn側から見た局面の評価を返す */
  private static eval(board: Board, turn: Color): number {
    let v = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board.getColor(x, y) === turn) {
          v += stoneValues[y][x];
        }
      }
    }
    return v;
  }
}
