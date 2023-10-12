// Run when Electron needs elevated privileges

const fs = require('fs');

function getArguments() {
  return {
    path: process.argv[3],
  };
}

async function init() {
  const argv = getArguments();
  console.log('init', argv.path);
  fs.readdir(argv.path, (err, files) => {
    if (err) {
      console.log('init.error', err);
    } else {
      console.log('init.success', files);
    }
  })
}

init();
