import {CompositeLearningObject} from '../models/learningobjects';
import * as fs from 'fs';
import {Portfolio} from '../models/portfolio';
import {Course} from '../models/course';

function createRoot(): CompositeLearningObject | null {
  if (fs.existsSync('portfolio.yaml')) {
    return new Portfolio();
  } else if (fs.existsSync('course.md')) {
    return new Course();
  }
  return null;
}

export function generateCommand(): void {
  const rootLearnongObject = createRoot();

  if (rootLearnongObject) {
    rootLearnongObject.publish('public-site');
  } else {
    console.log('Course or Portfolio not found');
  }
}
