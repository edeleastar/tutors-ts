import {LearningObject} from './learningobjects';
import * as path from 'path';
const glob = require('glob');
import * as sh from 'shelljs';

export function copyTalk(src: string, dest: string): void {
  dest = dest + '/' + src;
  sh.mkdir('-p', dest);
  sh.cp('-rf', src + '/*.pdf', dest);
  sh.cp('-rf', src + '/*.zip', dest);
  sh.cp('-rf', src + '/*.png', dest);
  sh.cp('-rf', src + '/*.jpg', dest);
  sh.cp('-rf', src + '/*.jpeg', dest);
  sh.cp('-rf', src + '/*.gif', dest);
}

export class Talk extends LearningObject {
  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'film';
    this.reap();
  }

  reap(): void {
    this.link = 'error: missing pdf';
    let resourceList = glob.sync('*.pdf').sort();
    if (resourceList.length > 0) {
      const resourceName = path.parse(resourceList[0]).name;
      super.reap(resourceName);
      this.link = resourceList[0];
    }
  }

  publish(path: string): void {
    copyTalk(this.folder, path);
  }
}
