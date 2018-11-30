import * as sh from 'shelljs';
import { CompositeLearningObject, LearningObject } from './learningobjects';
import { publishTemplate, publishLos, reapLos } from './loutils';
import { copyFileToFolder, resizeImage } from '../utils/futils';

export class Topic extends CompositeLearningObject {
  topicUrl?: string;
  units: Array<LearningObject>;
  panelVideos: Array<LearningObject>;
  standardLos: Array<LearningObject>;

  constructor(parent: LearningObject) {
    super(parent);
    super.los = reapLos(this);
    this.icon = 'sitemap';
    this.reap('topic');
    this.link = 'index.html';
    this.lotype = 'topic';
    this.setDefaultImage();

    this.units = this.los.filter(lo => lo.lotype == 'unit');
    this.panelVideos = this.los.filter(lo => lo.lotype == 'panelvideo');
    this.standardLos = this.los.filter(lo => lo.lotype !== 'unit' && lo.lotype !== 'panelvideo');
  }

  setDefaultImage(): void {
    if (!this.img && this.los.length > 0) {
      this.img = this.los[0].folder!! + '/' + this.los[0].img;
    }
  }

  publish(path: string): void {
    console.log('::', this.title);
    sh.cd(this.folder!);
    const topicPath = path + '/' + this.folder;
    copyFileToFolder(this.img!, topicPath);
    resizeImage(topicPath + '/' + this.img);

    this.topicUrl = this.properties!.courseurl.substring(5) + '/' + this.folder;

    publishTemplate(topicPath, 'index.html', 'topic.njk', this);
    publishLos(topicPath, this.los);
    sh.cd('..');
  }
}
