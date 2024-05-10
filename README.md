# DemoScript

DemoScript is a simple tool to demo your TypeScript code. It allows you to create interactive demos in your project, provides a menu to select and run demos, and supports asking questions and displaying messages in the console. It uses [terminal-kit](https://www.npmjs.com/package/terminal-kit) module and exports it's `terminal` as part of this library, so you can use it to create more complex interfaces if needed.

## Installation

Inside your project directory, run:

```bash
npm install demoscript -D
```

## Usage
- Make demos by creating files ending with `.demo.ts`.
- Inside `package.json` scripts, add a script to run `demoscript`. Optional path to demo folder can be provided. By default, it looks for all `.demo.ts` files in the entire project directory (including `node_modules`).
```json
{
  "scripts": {
    "demo": "demoscript"
    // or
    "demo": "demoscript src/demos"
  }
}
```
- Now run the script using `npm run demo` (or whatever name you gave to the script). It will collect all demos and create a menu to run them.

## Example
Create a file ending with `.demo.ts` in your project directory. For example, `example.demo.ts`:

```typescript
import { group, demo, ask, say } from 'demoscript';

export default group('My Example Demos', 

  demo('Ask user to write', () => {
    const name = ask('What is your name?').read(String);
    const age = ask('What is your age?').read(parseInt);
    const yob = new Date().getFullYear() - age;
    say(`Hello, ${name}! You were born between ${yob - 1} and ${yob}.`);
  }),

  demo('Ask user to choose', () => {
    const numChoice = ask('Choose a number:').options(
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3 }
    );
    say(`You chose ${numChoice}.`);
  }),

  demo('Ask user to confirm', () => {
    const confirmed = ask('Are you sure?').confirm();
    say(confirmed ? 'You are sure!' : 'You are not sure!');
  })

);
```

**NOTE:** 
DemoScript looks only for default exports in `.demo.ts` files. 
You can export either a single demo or a group of demos.
If you want to use named exports, be sure to import them in another `.demo.ts` file and export default group of those demos.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.