import {CompositeLearningObject, LearningObject} from './learningobjects';
import {Book} from './book';
import {Talk} from './talk';
import {Topic} from './topic';
import {publishLos, publishTemplate, publishTemplate2, reapLos} from './loutils';
import {copyFileToFolder, getCurrentDirectory} from '../utils/futils';
import * as fs from 'fs';
import {CommandOptions} from '../controllers/commands';
import {Git} from './git';
import {Video} from './video';

export class Course extends CompositeLearningObject {
  labs: Book[] = [];
  talks: Talk[] = [];
  repos: Git[] = [];
  videos: Video[] = [];
  options: CommandOptions;
  resources: LearningObject[];

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

  findRepos(los: Array<LearningObject>): void {
    los.forEach(lo => {
      if (lo instanceof Git) {
        this.repos.push(lo);
      }
      if (lo instanceof Topic) {
        this.findRepos(lo.los);
      }
    });
  }

  findVideos(los: Array<LearningObject>): void {
    los.forEach(lo => {
      if (lo instanceof Video) {
        this.videos.push(lo);
      }
      if (lo instanceof Topic) {
        this.findVideos(lo.los);
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
    this.icon = 'film';
    this.reap('course');
    const ignoreList = this.getIgnoreList();
    this.los = this.los.filter(lo => ignoreList.indexOf(lo.folder) < 0);
    this.findLabs(this.los);
    this.findTalks(this.los);
    this.findRepos(this.los);
    this.findVideos(this.los);
    this.insertCourseRef(this.los);
  }

  publish(path: string): void {
    console.log(':: ', this.title);
    if ((path.charAt(0) !== '/') && (path.charAt(1) !== ':')) {
      path = getCurrentDirectory() + '/' + path;
    }
    publishTemplate2(path, 'index.html', 'course.html', this);
    copyFileToFolder(this.img, path);
    publishLos(path, this.los);
    this.talks.forEach(talk => {
      if (talk.parent === this) {
        talk.parentFolder = './';
      }
    });
    this.resources = this.labs;
    publishTemplate(path, '/labwall.html', 'wall.html', this);
    this.resources = this.talks;
    publishTemplate(path, '/talkwall.html', 'wall.html', this);
    this.resources = this.videos;
    publishTemplate(path, '/videowall.html', 'wall.html', this);
    this.resources = this.repos;
    publishTemplate(path, '/repowall.html', 'wall.html', this);
  }
}
