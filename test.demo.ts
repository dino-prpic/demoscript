import { ask, demo, say } from "./src";

export default demo('Ask Demo', async function () {
  const name = await ask('What is your name?').read(String);
  const age = await ask('What is your age?').read(parseInt);
  // say('Hello ', name, '\n', 'You are ', age, ' years old');
  say(`Hello ${name}!\nYou are ${age} years old...`);
  const like = await ask('Do you like this demo?').confirm();
  say(like ? 'Grape' : 'Jebiga');
  const num = await ask('Choose a number:').options(
    { label: 'One', value: 0 },
    { label: 'Two', value: 1 },
    { label: 'Three', value: 2 }
  );
  say(['Bye', 'Ciao', 'Adios'][num]!);
});