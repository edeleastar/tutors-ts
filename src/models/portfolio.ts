import {CompositeLearningObject, LearningObject} from './learningobjects';
import {publishTemplate} from './loutils';
import {getCurrentDirectory, verifyFolder} from '../utils/futils';
import {Course} from './course';
import * as fs from 'fs';
import * as sh from 'shelljs';
import * as yaml from 'yamljs';
import {CommandOptions} from '../controllers/commands';

interface CourseGroup {
  title: string;
  description: string;
  modules: string[];
  courses: Array<Course>;
}

export class Portfolio extends CompositeLearningObject {
  courseGroups: Array<CourseGroup> = [];
  options: CommandOptions;
  subtitle: string;

  constructor(options: CommandOptions, parent?: LearningObject) {
    super(parent);
    this.options = options;
    this.icon = 'film';
    this.reap();
  }

  reap(): void {
    const yamlData = yaml.load('./portfolio.yaml');
    this.title = yamlData.title;
    this.subtitle = yamlData.subtitle;
    this.gitterid = yamlData.gitterid;
    this.credits = yamlData.credits;
    yamlData.courseGroups.forEach((courseGroup: CourseGroup) => {
      courseGroup.courses = new Array<Course>();
      courseGroup.modules.forEach((module: string) => {
        if (fs.existsSync(module)) {
          sh.cd(module);
          const course = new Course(this.options, this);
          if (course) {
            courseGroup.courses.push(course);
          }
          sh.cd('..');
        } else {
          console.log('- could not find ' + module);
        }
      });
      this.courseGroups.push(courseGroup);
    });
  }

  publish(path: string): void {
    const absPath = getCurrentDirectory() + '/' + path;

    publishTemplate(absPath, 'index.html', 'portfolio.html', this);

    for (let courseGroup of this.courseGroups) {
      for (let course of courseGroup.courses) {
        const coursePath = absPath + '/' + course.folder;
        verifyFolder(coursePath);
        sh.cd(course.folder);
        course.publish(coursePath);
        sh.cd('..');
      }
    }

    for (let courseGroup of this.courseGroups) {
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