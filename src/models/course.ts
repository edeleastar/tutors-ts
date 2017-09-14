import { CompositeLearningObject, LearningObject } from './learningobjects';
import { Topic } from './topic';
import { findLos, publishLos, publishTemplate, reapLos } from './loutils';
import {
  copyFileToFolder,
  getCurrentDirectory,
  getIgnoreList,
} from '../utils/futils';
import { CommandOptions } from '../controllers/commands';

interface LoWall {
  course: Course;
  los: Array<LearningObject>;
}

export class Course extends CompositeLearningObject {
  options: CommandOptions;
  walls: LoWall[] = [];

  insertCourseRef(los: Array<LearningObject>): void {
    los.forEach(lo => {
      lo.course = this;
      if (lo instanceof Topic) {
        this.insertCourseRef(lo.los);
      }
    });
    this.course = this;
  }

  constructor(options?: CommandOptions, parent?: LearningObject) {
    super(parent);
    if (options) {
      this.options = options;
    }
    this.los = reapLos(this);
    this.lotype = 'course';
    this.icon = 'book';
    this.reap('course');
    this.link = 'index.html';
    const ignoreList = getIgnoreList();
    if (!options) {
      this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder) < 0);
    } else if (!options.private) {
      this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder) < 0);
    }
    this.insertCourseRef(this.los);

    const talks = findLos(this.los, 'talk');
    talks.forEach(talk => {
      if (talk.parent === this) {
        talk.parentFolder = './';
      }
    });

    this.walls.push({ course: this, los: findLos(this.los, 'talk') });
    this.walls.push({ course: this, los: findLos(this.los, 'lab') });
    this.walls.push({ course: this, los: findLos(this.los, 'video') });
    this.walls.push({ course: this, los: findLos(this.los, 'git') });
    this.walls.push({ course: this, los: findLos(this.los, 'archive') });
  }

  publish(path: string): void {
    console.log(':: ', this.title);
    if (path.charAt(0) !== '/' && path.charAt(1) !== ':') {
      path = getCurrentDirectory() + '/' + path;
    }
    publishTemplate(path, 'index.html', 'course.njk', this);
    copyFileToFolder(this.img, path);
    publishLos(path, this.los);

    this.walls.forEach(loWall => {
      if (loWall.los.length > 0) {
        publishTemplate(
          path,
          '/' + loWall.los[0].lotype + 'wall.html',
          'wall.njk',
          loWall,
        );
      }
    });
  }
}
