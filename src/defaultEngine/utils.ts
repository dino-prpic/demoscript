export const BREAK = '\n';
export const EMPTY = '\u00A0';
export const SEPARATOR = '─';
export const PADDING = {
  EMPTY:    '    ',
  START:    ' ┌─ ',
  REGULAR:  ' │  ',
  INPUT:    '🔹  ',
  OUTPUT:   '🔸  ',
  ERROR:    '❌  ',
  DASHED:   ' ┆  ',
  END:      ' └─ '
};
export function br(type: keyof typeof PADDING = 'REGULAR') {
  return BREAK + PADDING[type];
}