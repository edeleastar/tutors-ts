import program = require('commander');
import {newCommand} from './newcommand';
import {CompositeLearningObject} from '../models/learningobjects';
import * as fs from 'fs';
import {Portfolio} from '../models/portfolio';
import {Course} from '../models/course';
import {copyFolder} from '../utils/futils';

export interface CommandOptions {
  version: string;
  templates: boolean;
  'new': boolean;
  'private': boolean;
  rootPath: string;
  [propName: string]: any;
}

function createRoot(options: CommandOptions): CompositeLearningObject | null {
  if (fs.existsSync('portfolio.yaml')) {
    return new Portfolio(options);
  } else if (fs.existsSync('course.md')) {
    return new Course(options);
  }
  return null;
}

export class Commands {
  rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    program.arguments('<file>').version(require('../../package.json').version)
        .option('-n, --new', 'Create a template course')
        .option('-p, --private', 'Generate full private site')
        .option('-t, --templates', 'Emit templates & stylesheets')
        .parse(process.argv);
  }

  exec(): void {
    const options = program.opts() as CommandOptions;
    options.rootPath = this.rootPath;
    console.log('tutors-ts course web generator: ' + options.version);
    if (options.new) {
      newCommand();
    } else {
      const rootLearningObject = createRoot(options);
      if (rootLearningObject) {
        rootLearningObject.publish('public-site');
      } else {
        console.log ('Cannot locate course.md or portfolio.yaml');
      }
    }
  }
}
