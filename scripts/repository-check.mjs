import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const MAX_REPOSITORY_BYTES = 10 * 1024 * 1024;
const failures = [];

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function report(label, passed, detail) {
  const marker = passed ? 'PASS' : 'FAIL';
  console.log(`${marker}  ${label}${detail ? ` — ${detail}` : ''}`);
  if (!passed) failures.push(label);
}

try {
  const currentBranch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  const branchOkay = currentBranch === 'main' || (process.env.CI && currentBranch === 'HEAD');
  report('Current branch is main', Boolean(branchOkay), currentBranch);

  const localBranches = git(['for-each-ref', '--format=%(refname:short)', 'refs/heads/'])
    .split('\n')
    .filter(Boolean);
  const branchSetOkay = localBranches.length === 0
    || (localBranches.length === 1 && localBranches[0] === 'main');
  report('Only one local branch exists', branchSetOkay, localBranches.join(', ') || 'detached CI checkout');

  const trackedFiles = git(['ls-files', '-z']).split('\0').filter(Boolean);
  const forbidden = trackedFiles.filter((file) => (
    file.startsWith('node_modules/')
    || file.startsWith('dist/')
    || file === '.env'
    || (file.startsWith('.env.') && file !== '.env.example')
    || file.endsWith('.tsbuildinfo')
  ));
  report('No generated files or secrets are tracked', forbidden.length === 0, forbidden.join(', '));

  const trackedBytes = trackedFiles.reduce((total, file) => {
    try {
      return total + statSync(file).size;
    } catch {
      return total;
    }
  }, 0);
  report(
    'Tracked source remains below 10 MB',
    trackedBytes < MAX_REPOSITORY_BYTES,
    `${(trackedBytes / 1024).toFixed(1)} KiB`
  );

  const objectStats = Object.fromEntries(
    git(['count-objects', '-v'])
      .split('\n')
      .map((line) => line.split(':').map((part) => part.trim()))
      .filter((parts) => parts.length === 2)
  );
  const gitKiB = Number(objectStats.size || 0) + Number(objectStats['size-pack'] || 0);
  report('Git object database remains below 10 MB', gitKiB < 10 * 1024, `${gitKiB} KiB`);

  const status = git(['status', '--porcelain']);
  report('Working tree is clean', status.length === 0, status || 'clean');
} catch (error) {
  failures.push('Repository inspection');
  console.error('FAIL  Repository inspection could not complete.');
  console.error(error instanceof Error ? error.message : error);
}

if (failures.length > 0) {
  console.error(`\nRepository check failed: ${failures.join(', ')}`);
  process.exit(1);
}

console.log('\nRepository check passed.');
