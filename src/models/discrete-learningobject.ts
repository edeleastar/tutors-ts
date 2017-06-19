import { LearningObject } from './learningobjects';
const glob = require('glob');
import * as path from 'path';
import { copyResource } from './loutils';

export abstract class DiscreteLearningObject extends LearningObject {
  constructor(parent: LearningObject) {
    super(parent);
  }

  reap(pattern: string): void {
    this.link = 'error: missing ' + this.lotype;
    let resourceList = glob.sync(pattern).sort();
    if (resourceList.length > 0) {
      const resourceName = path.parse(resourceList[0]).name;
      super.reap(resourceName);
      this.link = resourceList[0];
    }
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}

export class Talk extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'object group';
    this.lotype = 'talk';
    this.reap('*.pdf');
  }
}

export class Archive extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'archive';
    this.lotype = 'archive';
    this.reap('*.zip');
  }
}
