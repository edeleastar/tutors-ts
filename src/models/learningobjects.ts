import * as fs from 'fs';
import * as path from 'path';
import { getImageFile, getParentFolder, readPropsFromTree } from '../utils/futils';
import { getHeader, parseWithoutHeader } from '../utils/mdutils';
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
  jsonProperties?: string;

  protected constructor(parent?: LearningObject) {
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
    if (fs.existsSync('properties.yaml')) {
      this.jsonProperties = JSON.stringify(this.properties);
    } else {
      this.jsonProperties = '{}';
    }
    if (fs.existsSync(pattern + '.md')) {
      this.title = getHeader(pattern + '.md');
      this.title = this.title + ' ';

      this.objectivesWithoutHeader = parseWithoutHeader(pattern + '.md');
      this.objectivesWithoutHeader = this.objectivesWithoutHeader.replace(/(\r\n|\n|\r)/gm, '');
    } else {
      this.title = pattern;
    }
  }

  abstract publish(path: string): void;
}

export abstract class CompositeLearningObject extends LearningObject {
  los: Array<LearningObject> = [];

  protected constructor(parent?: LearningObject) {
    super(parent);
  }
}
