#!/usr/bin/env -S ts-node

import { terminal } from 'terminal-kit';
import { Demo, DemoGroup, ask, group } from '.';
import path from 'path';
import fs from 'fs';

const projectDir = process.cwd();
const selectedDir = (process.argv[2] || '.').split('/');
const dir = path.join(projectDir, ...selectedDir);

async function loadMain() {
  const demoFiles = fs
    .readdirSync(dir, { recursive: true })
    .map((file) => String(file))
    .filter((file) => file.endsWith('.demo.ts'));
  const demos: (Demo | DemoGroup)[] = [];
  for (const file of demoFiles) {
    const filePath = path.join(dir, file);
    const module = await import(filePath);
    const demo = module.default;
    if (!demo || !demo.title || (!demo.run && !demo.items)) continue;
    demos.push(demo);
  }
  return group('Main', ...demos);
}

(async () => {

  terminal('Finding demos in ').blue(projectDir)('\n')

  terminal.addListener('key', (key: string) => {
    if (key === 'CTRL_C') {
      terminal.processExit(1);
    }
  });

  const main = await loadMain();
  await run(main);
  
  async function run(demoOrGroup: Demo | DemoGroup) {
    if (!('title' in demoOrGroup)) throw new Error('Invalid demo or group');
    terminal.fullscreen(true);
    terminal.inverse.bold(demoOrGroup.title.padEnd(terminal.width, '\u00A0'));

    if ('run' in demoOrGroup) {
      await demoOrGroup.run();
      terminal('\n\n', '-'.repeat(terminal.width));
      await (await ask().options(
        { label: 'Run again', value: demoOrGroup.run },
        { label: 'Main menu', value: async () => run(main) },
        { label: 'Exit', value: async () => terminal.processExit(0) }
      ))();
      return;
    }
    else if ('items' in demoOrGroup) {
      const selection = await ask('Choose demo:').options(
        ...demoOrGroup.items.map((item) => ({
          label: 'title' in item ? item.title : 'Untitled',
          value: item,
        }))
      )
      await run(selection);
    }
  }

})();


