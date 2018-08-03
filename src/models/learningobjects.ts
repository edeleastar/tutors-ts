import * as fs from 'fs';
import * as path from 'path';
const glob = require('glob');
import { getImageFile, getParentFolder, readPropsFromTree } from '../utils/futils';
import { getHeader, padRight, parse, parseWithoutHeader } from '../utils/mdutils';
import { Properties } from './properties';

export abstract class LearningObject {
  parent?: LearningObject;
  course?: LearningObject;
  title?: string;
  img?: string;
  icon?: string;
  faIcon?: string;
  link?: string;
  folder?: string;
  parentFolder?: string;
  objectives?: string;
  objectivesWithoutHeader?: string;
  credits?: string;
  url?: string;
  absoluteLink?: boolean;
  lotype: string;
  properties?: Properties;

  constructor(parent?: LearningObject) {
    if (parent) {
      this.parent = parent;
    }
    this.lotype = 'lo';
  }

  reap(pattern: string): void {
    this.folder = path.basename(process.cwd());
    this.parentFolder = getParentFolder();
    this.img = getImageFile(pattern);
    this.properties = readPropsFromTree();
    if (fs.existsSync(pattern + '.md')) {
      this.title = getHeader(pattern + '.md');
      this.title = this.title + ' ';
      // this.title = padRight(this.title, 40 - this.title.length, '_' );
      // this.objectives = parse(pattern + '.md');
      this.objectivesWithoutHeader = parseWithoutHeader(pattern + '.md');
    } else {
      this.title = pattern;
    }
  }

  abstract publish(path: string): void;
}

export abstract class CompositeLearningObject extends LearningObject {
  los: Array<LearningObject> = [];

  constructor(parent?: LearningObject) {
    super(parent);
  }
}
