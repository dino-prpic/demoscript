import { terminal } from 'terminal-kit';
export { terminal };

export function demo(
  title: string,
  action: () => Promise<void>
) {
  const d = { title, run: async () => {
    terminal.fullscreen(true);
    terminal.inverse.bold(title.padEnd(terminal.width, '\u00A0'), '\n');
    try {
      await action();
    } catch (err: any) {
      terminal.red.bold('\n', 'ERROR ')(err.message);
    }
  }};
  return d;
}
export type Demo = ReturnType<typeof demo>;
export type DemoGroup = { title: string, items: (Demo | DemoGroup)[] };

export function group(title: string, ...demos: (Demo | DemoGroup)[]) {	
  return { title, items: demos } as DemoGroup;
}

export function ask (question?: string) {
  if (question) terminal.bold('\n', question);
  return { read, confirm, options };
}

export function say (...messages: any[]) {
  return terminal('\n', ...messages);
}


// INPUTS
async function read<T> (
  transform: (input: string) => T,
  suggestion: string = ''
): Promise<ReturnType<typeof transform>> {
  terminal('\n> ');
  const input = terminal.inputField({
    cancelable: true,
    default: suggestion
  });
  const value = await input.promise;
  if (value === undefined) throw new Error('Cancelled');
  return transform(value);
}

async function confirm () {
  terminal(' (y/n)', '\n', '> ');
  const input = terminal.yesOrNo({
    yes: ['y', 'Y', 'ENTER', 'SPACE'],
    no: ['n', 'N', 'ESC'],
    echoYes: 'Yes',
    echoNo: 'No'
  }).promise;
  if (input === undefined) {
    throw new Error('Cancelled');
  }
  return await input;
}

async function options<T> (
  ...options: { label: string, value: T }[]
) {
  const labels = options.map(option => option.label);
  terminal.grabInput({ mouse: 'button' });
  const response = await terminal.singleRowMenu(labels, {
    cancelable: true,
    selectedStyle: terminal.underline,
    separator: '    '
  }).promise;
  const i = response.selectedIndex;
  if (i === undefined) throw new Error('Cancelled');
  terminal.nextLine(0).previousLine(0).eraseLine()('> ', options[i]!.label);
  return options[i]!.value;
}