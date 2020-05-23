import { Board } from "./board";
import { Move } from "./move";

export class Ai {
  static search(board: Board): Move {
    const legalMoves = board.legalMoves();
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }
}
