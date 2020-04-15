import { parseApiDoc } from './parse-api-doc';
import * as path from 'path';
import * as fs from 'fs';

const apiDocsPath = path.resolve(process.cwd(), 'docs', 'api.md');

const apiDocsContent = fs.readFileSync(apiDocsPath, { encoding: 'utf8' });

parseApiDoc(apiDocsContent);
