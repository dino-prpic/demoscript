import { terminal } from "terminal-kit";
import { Demo, DemoGroup } from '..';
import { BREAK, PADDING, SEPARATOR, br } from "./utils";
import { choose } from "./input";

export * from './input';

export function print(text: string) {
  terminal.dim(br())(br('OUTPUT')).bold(text.replace(/\n/g, br('DASHED')));
}

export async function init(main: DemoGroup) {
  terminal.addListener('key', (key: string) => {
    if (key === 'CTRL_C') {
      terminal.processExit(1);
    }
  });
  runGroup(main);
}

async function runDemo({ title, action }: Demo) {
  terminal
    .clear()
    .dim(br('START'))
    .bgBrightColor(Math.floor(Math.random() * 8))
    .bold.italic('  ' + title + '  ')
    .bgDefaultColor()
    .dim(' ', SEPARATOR.repeat(terminal.width - title.length - 6 - PADDING.START.length));
  try {
    await action();
  } catch (err: any) {
    terminal.red.bold(br('ERROR'), 'ERROR ')(err.message);
  }
  terminal.dim(br(), br('END') + 'demo finished '.padEnd(terminal.width - PADDING.END.length, SEPARATOR), BREAK);
}

async function runGroup(group: DemoGroup) {
  terminal
    .clear()
    .dim(br('EMPTY'))
    .bold.italic('  ' + group.title + '  ')

  if (group.items.length === 0) {
    terminal('No demos found', '\n');
    return;
  }
  if (group.items.length === 1) {
    await run(group.items[0]!);
    return;
  }
  const selection = await choose('', 
    group.items.map((item) => item.title)
  )
  await run(group.items[selection]!);
}

export async function run(demoOrGroup: Demo | DemoGroup) {
  if (!('title' in demoOrGroup)) throw new Error('Invalid demo or group');
  if ('action' in demoOrGroup) {
    await runDemo(demoOrGroup);
    return;
  }
  else if ('items' in demoOrGroup) {
    await runGroup(demoOrGroup);
  }
}