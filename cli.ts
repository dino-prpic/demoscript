#!/usr/bin/env -S ts-node

import { Command } from 'commander';
import { Demo, DemoGroup, group } from './dist';
import EngineInterface from './dist/engineTypes';
import path from 'path';
import fs from 'fs';

const program = new Command();
program
  .version('0.0.1')
  .description('Run demos from a directory');
program
  .option('-p, --path <path>', 'find demos in path', '.')
  .option('-e, --engine <engine>', 'engine source file', './dist/defaultEngine');
program.parse(process.argv)
const options = program.opts();

const projectDir = process.cwd();
const demosDir = path.join(projectDir, ...options.path.split('/'));
const engineSource = options.engine as string;

async function loadMain() {
  const demoFiles = fs
    .readdirSync(demosDir, { recursive: true })
    .map((file) => String(file))
    .filter((file) => file.endsWith('.demo.ts'));
  const demos: (Demo | DemoGroup)[] = [];
  for (const file of demoFiles) {
    const filePath = path.join(demosDir, file);
    const module = await import(filePath);
    const demo = module.default;
    if (!demo || !demo.title || (!demo.action && !demo.items)) continue;
    demos.push(demo);
  }
  return group('Main', ...demos);
}

(async () => {
  const ENGINE = await import(engineSource) as EngineInterface;
  const main = await loadMain();
  await ENGINE.init(main);
})();



