import { LearningObject } from './learningobjects';
import { Topic } from './topic';
import * as sh from 'shelljs';
import { copyFileToFolder, resizeImage } from '../utils/futils';
import { publishLos } from './loutils';

export class Unit extends Topic {
  standardLos: Array<LearningObject>;

  constructor(parent: LearningObject) {
    super(parent);
    this.lotype = 'unit';

    this.standardLos = this.los.filter(lo => lo.lotype !== 'panelvideo');
  }

  publish(path: string): void {
    console.log('::', this.title);
    sh.cd(this.folder!);
    const topicPath = path + '/' + this.folder;
    //const topicPath = path;
    copyFileToFolder(this.img!, topicPath);
    resizeImage(topicPath + '/' + this.img);

    this.topicUrl = this.properties!.courseurl.substring(5) + '/' + this.folder;
    publishLos(topicPath, this.los);
    sh.cd('..');
  }
}
