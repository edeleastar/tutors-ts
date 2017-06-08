import program = require('commander');
import {newCommand} from './newcommand';
import {generateCommand} from './generatecommand';

export class Commands {
  constructor() {
    program.arguments('<file>').version(require('../../package.json').version)
        .option('-n, --new', 'Create a template course')
        .parse(process.argv);
  }

  exec(): void {
    if (program.new) {
      newCommand();
    } else {
      generateCommand();
    }
  }
}
