import * as fs from 'fs';

const glob = require('glob');
import { LearningObject } from './learningobjects';
import * as path from 'path';
import { copyResource } from './loutils';
import { readFile, resizeImage } from '../utils/futils';

export abstract class DiscreteLearningObject extends LearningObject {
  protected constructor(parent: LearningObject) {
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
    copyResource(this.folder!, path);
    if (this.img) {
      resizeImage(path + '/' + this.folder + '/' + this.img);
    }
  }
}

export class Talk extends DiscreteLearningObject {
  videoid = 'none';

  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'object group';
    this.lotype = 'talk';
    this.reap('*.pdf');
    if (fs.existsSync('videoid')) {
      this.videoid = readFile('videoid');
    }
  }
}

export class PanelTalk extends DiscreteLearningObject {
  videoid = 'none';

  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'object group';
    this.lotype = 'paneltalk';
    this.reap('*.pdf');
    if (fs.existsSync('videoid')) {
      this.videoid = readFile('videoid');
    }
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

export class Reference extends DiscreteLearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'list layout';
    this.lotype = 'reference';
    this.reap('*.pdf');
  }
}
