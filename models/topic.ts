import {CompositeLearningObject, LearningObject} from './learningobjects';
import {publishTemplate, publishLos, reapLos} from './loutils';
import {copyFileToFolder} from '../utils/futils';
import * as sh from 'shelljs';
import {Talk} from "./talk";
import {Book} from "./book";
import {Video} from "./video";

export class Topic extends CompositeLearningObject {

  talks: Array<LearningObject>;
  labs: Array<LearningObject>;
  videos: Array<LearningObject>;
  topics: Array<LearningObject>;
  subtopic: boolean;

  constructor(parent: LearningObject) {
    super(parent);
    super.los = reapLos(this);
    this.icon = 'film';
    this.reap('topic');
    this.talks = this.los.filter(lo => lo instanceof Talk);
    this.labs = this.los.filter(lo => lo instanceof Book);
    this.videos = this.los.filter(lo => lo instanceof Video);
    this.topics = this.los.filter(lo => lo instanceof Topic);
    if (parent instanceof Topic) {
      this.subtopic = true;
    }
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
    publishTemplate(topicPath, 'index.html', 'topic.html', this);

    publishLos(topicPath, this.los);
    sh.cd('..');
  }
}
