import { CompositeLearningObject, LearningObject } from './learningobjects';
import { Topic } from './topic';
import { findLos, publishLos, publishTemplate, reapLos } from './loutils';
import { copyFileToFolder, getCurrentDirectory } from '../utils/futils';
import * as fs from 'fs';
import { CommandOptions } from '../controllers/commands';

interface LoWall {
  course: Course;
  los: Array<LearningObject>;
}

export class Course extends CompositeLearningObject {
  options: CommandOptions;
  resources: LearningObject[];
  walls: LoWall[] = [];

  insertCourseRef(los: Array<LearningObject>): void {
    los.forEach(lo => {
      lo.course = this;
      if (lo instanceof Topic) {
        this.insertCourseRef(lo.los);
      }
    });
  }

  getIgnoreList(): string[] {
    const ignoreList: string[] = [];
    if (fs.existsSync('mbignore')) {
      const array = fs.readFileSync('mbignore').toString().split('\n');
      for (let i = 0; i < array.length; i++) {
        ignoreList[i] = array[i].trim();
      }
    }
    return ignoreList;
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
    const ignoreList = this.getIgnoreList();
    this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder) < 0);

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

  publishWalls(path: string, wall: LoWall[]): void {
    wall.forEach(loWall => {
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

  publish(path: string): void {
    console.log(':: ', this.title);
    if (path.charAt(0) !== '/' && path.charAt(1) !== ':') {
      path = getCurrentDirectory() + '/' + path;
    }
    publishTemplate(path, 'index.html', 'course.njk', this);
    copyFileToFolder(this.img, path);
    publishLos(path, this.los);

    this.publishWalls(path, this.walls);
  }
}
