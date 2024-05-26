import { terminal } from "terminal-kit";
import { PADDING, br } from "./utils";

export async function text(
  label: string,
  suggestion?: string
) {
  terminal.dim(br().repeat(2)).bold(label);
  terminal(br('INPUT'));
  const input = terminal.inputField({
    cancelable: true,
    default: suggestion
  });
  const value = await input.promise;
  if (value === undefined) throw new Error('Cancelled');
  return value;
}

export async function confirm(label: string) {
  terminal
    .dim(br().repeat(2)).bold(label)
    (' (y/n)', br('INPUT'));
  const input = terminal.yesOrNo({
    yes: ['y', 'Y', 'ENTER', 'SPACE'],
    no: ['n', 'N', 'ESC'],
    echoYes: 'Yes',
    echoNo: 'No',
  }).promise;
  if (input === undefined) {
    terminal
      .nextLine(1)
      .eraseLine
    throw new Error('Cancelled');
  }
  return await input;
}

export async function choose (
  label: string,
  labels: string[]
) {
  terminal.dim(br().repeat(2)).bold(label);
  terminal.hideCursor();
  const response = await terminal.singleColumnMenu(labels, {
    cancelable: true,
    leftPadding: PADDING.EMPTY,
    selectedLeftPadding: PADDING.INPUT,
    selectedStyle: terminal,
  }).promise;
  terminal.hideCursor(false);
  const i = response.selectedIndex;
  const selected = labels[i];
  if (!selected) throw new Error('Cancelled');
  for (let i = 0; i < labels.length; i++) {
    terminal.previousLine(1).eraseLine();
  }
  terminal
    .previousLine(1)
    (br('INPUT'), selected);
  return i;
}