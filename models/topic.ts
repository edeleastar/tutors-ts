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
