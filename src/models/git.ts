import { LearningObject } from './learningobjects';
import { readFile } from '../utils/futils';
import { copyResource } from './loutils';

export class Git extends LearningObject {
  githubid: string;

  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'git square';
    super.reap('github');
    this.link = readFile('githubid');
    this.absoluteLink = true;
    this.lotype = 'git';
  }

  publish(path: string): void {
    copyResource(this.folder, path);
  }
}
