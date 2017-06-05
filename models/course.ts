import {CompositeLearningObject, LearningObject} from './learningobjects';
import {Book} from './book';
import {Talk} from './talk';
import {Topic} from './topic';
import {publishLos, publishTemplate, reapLos} from './loutils';
import {copyFileToFolder, getCurrentDirectory} from '../utils/futils';

export class Course extends CompositeLearningObject {
  labs: Book[] = [];
  talks: Talk[] = [];
  portfolio: boolean;

  findLabs(los: Array<LearningObject>): void {
    los.forEach(lo => {
      if (lo instanceof Book) {
        this.labs.push(lo);
      }
      if (lo instanceof Topic) {
        this.findLabs(lo.los);
      }
    });
  }

  findTalks(los: Array<LearningObject>): void {
    los.forEach(lo => {
      if (lo instanceof Talk) {
        this.talks.push(lo);
      }
      if (lo instanceof Topic) {
        this.findTalks(lo.los);
      }
    });
  }

  insertCourseRef(los: Array<LearningObject>): void {
    los.forEach(lo => {
      lo.course = this;
      if (lo instanceof Topic) {
        this.insertCourseRef(lo.los);
      }
    });
  }

  constructor(parent?: LearningObject) {
    super(parent);
    if (parent) {
      this.portfolio = true;
    }
    this.los = reapLos(this);
    this.icon = 'film';
    this.reap('course');
    this.findLabs(this.los);
    this.findTalks(this.los);
    this.insertCourseRef(this.los);
  }

  publish(path: string): void {
    console.log(':', this.title);
    if (path.charAt(0) !== '/') {
      path = getCurrentDirectory() + '/' + path;
    }
    publishTemplate(path, 'index.html', 'course.html', this);
    copyFileToFolder(this.img, path);
    publishLos(path, this.los);

    this.talks.forEach(talk => {
      if (talk.parent === this) {
        talk.parentFolder = './';
      }
    });
    publishTemplate(path, '/labwall.html', 'labwall.html', this);
    publishTemplate(path, '/talkwall.html', 'talkwall.html', this);
  }
}
