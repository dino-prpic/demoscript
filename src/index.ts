import EngineInterface from './engineTypes';

const engineSource = process.env.ENGINE_SOURCE || './defaultEngine';
let ENGINE: EngineInterface;
(async () => {
  ENGINE = await import(engineSource);
})();

export type Demo = { title: string, action: () => Promise<void> };
export function demo (
  title: string,
  action: () => Promise<void>
): Demo {
  return { 
    title, 
    action
  }
}

export type DemoGroup = { title: string, items: (Demo | DemoGroup)[] };
export function group (title: string, ...demos: (Demo | DemoGroup)[]) {	
  return { title, items: demos } as DemoGroup;
}

export function say(message: string) {
  ENGINE.print(message);
}

export function ask(question: string) {
  return { 
    read: async <T> (transform: (input: string) => T, suggestion?: string) => {
      const value = await ENGINE.text(question, suggestion);
      return transform(value);
    },
    confirm: async () => {
      return await ENGINE.confirm(question);
    },
    options: async <T> (...options: { label: string, value: T }[]) => {
      const labels = options.map(option => option.label);
      const selectedIndex = await ENGINE.choose(question, labels);
      return options[selectedIndex]!.value;
    }
  }
}