import * as sh from 'shelljs';
import { CompositeLearningObject, LearningObject } from './learningobjects';
import { publishTemplate, publishLos, reapLos } from './loutils';
import { copyFileToFolder } from '../utils/futils';
import { Book } from './book';
import { Archive, Talk } from './discrete-learningobject';
import {Git, Video} from './web-learning-object';

export class Topic extends CompositeLearningObject {
  talks: Array<LearningObject>;
  labs: Array<LearningObject>;
  losByType: Array<LearningObject>[] = [];
  topicUrl: string;

  constructor(parent: LearningObject) {
    super(parent);
    super.los = reapLos(this);
    this.icon = 'sitemap';
    this.reap('topic');
    this.link = 'index.html';
    this.lotype = 'topic';
    this.talks = this.los.filter(lo => lo instanceof Talk);
    this.labs = this.los.filter(lo => lo instanceof Book);
    this.labs = this.labs.concat(this.los.filter(lo => lo instanceof Git));

    this.losByType.push(this.los.filter(lo => lo instanceof Video));
    this.losByType.push(this.talks);
    this.losByType.push(this.labs);
    this.losByType.push(this.los.filter(lo => lo instanceof Archive));
    this.losByType.push(this.los.filter(lo => lo instanceof Topic));

    if (!this.img) {
      if (this.talks.length > 0) {
        this.img = this.talks[0].folder + '/' + this.talks[0].img;
      } else {
        if (this.labs.length > 0) {
          this.img = this.labs[0].folder + '/' + this.labs[0].img;
        }
      }
    }
  }

  publish(path: string): void {
    console.log('::', this.title);
    sh.cd(this.folder);
    const topicPath = path + '/' + this.folder;
    copyFileToFolder(this.img, topicPath);
    this.topicUrl = this.url.substring(5) + '/' + this.folder

    publishTemplate(topicPath, 'index.html', 'topic.njk', this);
    publishTemplate(topicPath, 'ajaxlabel.html', 'ajaxlabel.njk', this);
    publishTemplate(topicPath, 'indexmoodle.njk', 'indexmoodle.html', this);
    publishLos(topicPath, this.los);
    sh.cd('..');
  }
}
