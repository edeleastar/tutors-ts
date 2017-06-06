import {CompositeLearningObject, LearningObject} from './learningobjects';
import {publishTemplate, reapLos} from './loutils';
import {copyFileToFolder, getCurrentDirectory, verifyFolder} from '../utils/futils';
import {Course} from './course';
import * as fs from 'fs';
import * as sh from 'shelljs';
import * as yaml from 'yamljs';

export class Portfolio extends CompositeLearningObject {

  yaml: any;

  constructor(parent?: LearningObject) {
    super(parent);
    this.icon = 'film';
    this.reap();
  }

  reap(): void {
    super.reap('portfolio');

    this.yaml = yaml.load('./portfolio.yaml');
    for (let courseGroup of this.yaml.courseGroups) {
      courseGroup.courses = [];
      for (let module of courseGroup.modules) {
        if (fs.existsSync(module)) {
          // console.log('- ' + module);
          sh.cd(module);
          const course = new Course(this);
          if (course) {
            courseGroup.courses.push(course);
          }
          sh.cd('..');
        } else {
          console.log('- could not find ' + module);
        }
      }
    }
  }

  publish(path: string): void {
    const absPath = getCurrentDirectory() + '/' + path;

    publishTemplate(absPath, 'index.html', 'portfolio.html', this.yaml);

    for (let courseGroup of this.yaml.courseGroups) {
      for (let course of courseGroup.courses) {
        const coursePath = absPath + '/' + course.folder;
        verifyFolder(coursePath);
        sh.cd(course.folder);
        course.publish(coursePath);
        sh.cd('..');
      }
    }
  }
}
