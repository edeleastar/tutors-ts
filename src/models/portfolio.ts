import * as fs from 'fs';
import * as sh from 'shelljs';
import * as yaml from 'yamljs';
import { CompositeLearningObject, LearningObject } from './learningobjects';
import { publishLos, publishTemplate, reapLos } from './loutils';
import { copyFileToFolder, getCurrentDirectory, readPropsFromTree, verifyFolder } from '../utils/futils';
import { Course } from './course';
import { CommandOptions } from '../controllers/commands';
import { parse } from '../utils/mdutils';

interface CourseGroup {
  title: string;
  description: string;
  outline: string;
  modules: string[];
  courses: Array<Course>;
}

export class Portfolio extends CompositeLearningObject {
  courseGroups: Array<CourseGroup> = [];
  options: CommandOptions;
  subtitle = '';
  homeDir = '';

  constructor(options: CommandOptions, parent?: LearningObject) {
    super(parent);
    this.options = options;
    this.homeDir = getCurrentDirectory();
    this.icon = 'film';
    this.reap();
    this.lotype = 'portfolio';
  }

  reap(): void {
    const yamlData = yaml.load('./portfolio.yaml');
    super.los = reapLos(this);
    this.title = yamlData.title;
    this.subtitle = yamlData.subtitle;
    this.properties = readPropsFromTree();
    yamlData.courseGroups.forEach((courseGroup: CourseGroup) => {
      courseGroup.courses = new Array<Course>();
      if (courseGroup.outline) {
        courseGroup.description = parse(courseGroup.outline);
      }
      if (courseGroup.modules) {
        courseGroup.modules.forEach((module: string) => {
          if (fs.existsSync(module)) {
            sh.cd(module);
            const course = new Course(this.options, this);
            if (course) {
              course.folder = module;
              courseGroup.courses.push(course);
            }
            sh.cd(this.homeDir);
          } else {
            console.log('- could not find ' + module);
          }
        });
      }
      this.courseGroups.push(courseGroup);
    });
  }

  publish(path: string): void {
    const absPath = this.homeDir + '/' + path;

    for (let courseGroup of this.courseGroups) {
      for (let course of courseGroup.courses) {
        const coursePath = absPath + '/' + course.folder;
        sh.cd(course.folder!);
        if (course.properties!.submodule! != 'true') {
          course.absoluteLink = true;
          course.link = course.properties!.courseurl!;
        } else {
          course.link = course.folder + '/index.html';
          verifyFolder(coursePath);
          course.publish(coursePath);
        }
        sh.cd(this.homeDir);
      }
    }
    publishTemplate(absPath, 'index.html', 'portfolio.njk', this);
    publishLos(path, this.los);
    if (this.properties!!.favicon) {
      copyFileToFolder(this.properties!!.favicon, path);
    }
    if (this.properties!!.crest) {
      copyFileToFolder(this.properties!!.crest, path);
    }

    copyFileToFolder('favicon.ico', absPath);
  }
}
