import * as fs from 'fs';

import program = require('commander');
import { newCommand } from './newcommand';
import { CompositeLearningObject } from '../models/learningobjects';
import { Portfolio } from '../models/portfolio';
import { Course } from '../models/course';

export interface CommandOptions {
  version: string;
  templates: boolean;
  new: boolean;
  private: boolean;
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
    program
      .arguments('<file>')
      .version(require('../../package.json').version)
      .option('-p, --private', 'Generate full private site')
      .option('-u, --uikit', 'Generate UIKit based site (experimental)')
      .option('-n, --new', 'Create a template course')
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
        let site = 'public-site-uk';
        if (options.private) {
          site = 'private-site-uk';
        }
        rootLearningObject.publish(site);
      } else {
        console.log('Cannot locate course.md or portfolio.yaml. Change to course folder and try again. ');
      }
    }
  }
}
