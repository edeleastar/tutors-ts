const glob = require('glob');
import { LearningObject } from './learningobjects';
import { getHeader, parse, parseWithoutHeader } from '../utils/mdutils';
import * as path from 'path';
import {
  copyFolder,
  getDirectories,
  getImageFile,
  initEmptyPath, resizeImage,
} from '../utils/futils';
import * as sh from 'shelljs';
import { publishTemplate } from './loutils';

export class Chapter {
  file: string;
  title: string;
  shortTitle: string;
  content: string;
  contentWithoutHeader: string;
}

export class Book extends LearningObject {
  directories: Array<string>;
  chapters: Array<Chapter>;

  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'lab';
    this.faIcon = 'fas fa-flask fa-2x" style="color:#00BCD4"'
    this.reap();
    this.link = 'index.html';
    this.lotype = 'lab';
  }

  reapChapters(mdFiles: Array<string>): Array<Chapter> {
    const chapters: Array<Chapter> = [];
    mdFiles.forEach(chapterName => {
      const chapter = {
        file: chapterName,
        title: getHeader(chapterName),
        shortTitle: chapterName.substring(
          chapterName.indexOf('.') + 1,
          chapterName.lastIndexOf('.'),
        ),
        content: parse(chapterName),
        contentWithoutHeader: parseWithoutHeader(chapterName),
      };
      chapters.push(chapter);
    });
    return chapters;
  }

  reap(): void {
    let mdFiles = glob.sync('*.md').sort();
    if (mdFiles.length === 0) {
      mdFiles = ['error: missing lab'];
    }
    const resourceName = path.parse(mdFiles[0]).name;
    super.reap(resourceName);
    this.directories = getDirectories('.');
    this.chapters = this.reapChapters(mdFiles);
    this.title = this.chapters[0].shortTitle;
    this.img = getImageFile('img/main');
  }

  publish(path: string): void {
    sh.cd(this.folder);
    const labPath = path + '/' + this.folder;
    initEmptyPath(labPath);
    this.directories.forEach(directory => {
      copyFolder(directory, labPath);
    });
    publishTemplate(labPath, 'index.html', 'lab.njk', this);
    resizeImage(labPath + '/' + this.img)
    sh.cd('..');
  }
}
