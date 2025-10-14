
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');

const CHECKS = {
  GIT_REMOTE: {
    name: 'Git Remote Configuration',
    fn: () => {
      console.log('Verifying Git remote...');
      const remote = execSync('git remote -v').toString();
      const expectedRemote = 'https://github.com/DHamilton-rentfax/RentFax.git';
      if (!remote.includes(expectedRemote)) {
        return `Git remote is incorrect. Expected ${expectedRemote}, but got:\n${remote}`;
      }
      console.log('✅ Git remote is correct.');
      return null;
    },
  },
  ESSENTIAL_DIRS: {
    name: 'Essential Directories',
    fn: () => {
      console.log('Checking for essential directories...');
      const dirs = [
        'src/app/api',
        'src/app/(app)/admin',
        'src/components',
        'src/lib/firebase',
      ];
      const missingDirs = dirs.filter(dir => !fs.existsSync(path.join(projectRoot, dir)));
      if (missingDirs.length > 0) {
        return `Missing essential directories:\n- ${missingDirs.join('\n- ')}`;
      }
      console.log('✅ All essential directories are present.');
      return null;
    },
  },
  UNTRACKED_FILES: {
    name: 'Untracked TSX Files',
    fn: () => {
      console.log('Checking for untracked .tsx files...');
      const status = execSync('git status --porcelain').toString();
      const untrackedTsxFiles = status
        .split('\n')
        .filter(line => line.startsWith('??') && line.endsWith('.tsx'))
        .map(line => line.substring(3));

      if (untrackedTsxFiles.length > 0) {
        return `Found untracked .tsx files:\n- ${untrackedTsxFiles.join('\n- ')}`;
      }
      console.log('✅ No untracked .tsx files found.');
      return null;
    },
  },
};

async function run() {
  const errors = [];
  console.log('--- Running Pre-Push Sanity Checks ---');

  for (const key in CHECKS) {
    const check = CHECKS[key];
    try {
      const error = await check.fn();
      if (error) {
        errors.push({ name: check.name, message: error });
      }
    } catch (e) {
      errors.push({ name: check.name, message: e.message });
    }
    console.log('---');
  }

  if (errors.length > 0) {
    console.error('❌ Pre-push checks failed with the following errors:');
    errors.forEach(err => {
      console.error(`\n[${err.name}]`);
      console.error(err.message);
    });
    console.error('\nPlease fix the issues above and try pushing again.');
    process.exit(1);
  } else {
    console.log('✅ All pre-push checks passed successfully.');
    process.exit(0);
  }
}

run();
