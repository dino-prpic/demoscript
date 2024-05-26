import { DemoGroup, Demo } from '..';

export default interface EngineInterface {
  init: (main: DemoGroup) => Promise<void>;
  run: (demoOrGroup: Demo | DemoGroup) => Promise<void>;
  print: (text: string) => void;
  text: (label: string, suggestion?: string) => Promise<string>;
  confirm: (label: string) => Promise<boolean>;
  choose: (label: string, labels: string[]) => Promise<number>;
}
