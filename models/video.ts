import {LearningObject} from './learningobjects';
import * as path from 'path';
const glob = require('glob');
import * as sh from 'shelljs';
import {readFile} from '../utils/futils';

export class Video extends LearningObject {
  videoid: string;

  constructor(parent: LearningObject) {
    super(parent);
    this.icon = 'photo';
    super.reap('video');
    this.videoid = readFile('videoid');
  }

  publish(path: string): void {
    console.log('  -->' + this.title);
  }
}
