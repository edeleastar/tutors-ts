import { LearningObject } from './learningobjects';
import { readFile } from '../utils/futils';
const glob = require('glob');
import * as sh from 'shelljs';
import * as path from 'path';
import { copyResource } from './loutils';

export class Archive extends LearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'archive';
    this.reap();
  }

  reap(): void {
    this.link = 'error: missing archive';
    let resourceList = glob.sync('*.zip').sort();
    if (resourceList.length > 0) {
      const resourceName = path.parse(resourceList[0]).name;
      super.reap(resourceName);
      this.lotype = 'archive';
      this.link = resourceList[0];
    }
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}
