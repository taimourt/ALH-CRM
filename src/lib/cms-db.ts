import fs from 'fs';
import path from 'path';
import { CMSDatabase } from './cms-types';
import { getInitialCMSDatabase } from './cms-seed';

export {
  INITIAL_BLOG_POSTS,
  INITIAL_MATERIAL_RATES,
  INITIAL_SETTINGS,
  INITIAL_INQUIRIES,
  getInitialCMSDatabase,
} from './cms-seed';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'cms-database.json');

// Read CMS Database from local JSON file
export function readCMSDatabase(): CMSDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDB = getInitialCMSDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
      return initialDB;
    }

    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return parsed;
  } catch (error) {
    console.error('Error reading CMS database file:', error);
    return getInitialCMSDatabase();
  }
}

// Write CMS Database to local JSON file
export function writeCMSDatabase(db: CMSDatabase): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    db.lastBackupDate = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing CMS database file:', error);
    return false;
  }
}
