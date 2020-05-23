export enum GameResult {
  Playing,
  BlackWin,
  WhiteWin,
  Draw,
}

export function gameResultToString(g: GameResult): string {
  switch (g) {
    case GameResult.Playing:
      return "プレイ中";
    case GameResult.BlackWin:
      return "黒の勝ち";
    case GameResult.WhiteWin:
      return "白の勝ち";
    case GameResult.Draw:
      return "引き分け";
  }
}
