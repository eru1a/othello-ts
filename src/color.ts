export enum Color {
  None,
  Black,
  White,
}

// enumにメソッド生やすことは出来ないの?
export function colorToString(c: Color): string {
  switch (c) {
    case Color.None:
      return "空";
    case Color.Black:
      return "黒";
    case Color.White:
      return "白";
  }
}

export function colorInv(c: Color): Color {
  switch (c) {
    case Color.None:
      return Color.None;
    case Color.Black:
      return Color.White;
    case Color.White:
      return Color.Black;
  }
}
