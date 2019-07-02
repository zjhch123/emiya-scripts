const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const inquirer = require('inquirer')
const os = require('os')

const paths = require('../config/paths')

const root = paths.appROOT
const scriptRoot = path.resolve(__dirname, '../')

const ownPackage = require('../package.json')
const appPackage = require(path.resolve(paths.appROOT, 'package.json'))

const ownPackageName = ownPackage.name;

const green = chalk.green;
const cyan = chalk.cyan;

const verifyAbsent = (file) => {
  if (fs.existsSync(path.join(root, file))) {
    console.error(
      `\`${file}\` already exists in your app folder. We cannot ` +
        'continue as you would lose all the changes in that file or directory. ' +
        'Please move or delete it (maybe make a copy for backup) and run this ' +
        'command again.'
    );
    process.exit(1);
  }
}

const staticResources = {
  folder: [ 
    "config",
    "scripts" 
  ],
  file: [
    ".browserslistrc",
    ".eslintignore",
    ".eslintrc.js",
    "postcss.config.js"
  ],
}

const start = () => {
  if (appPackage.devDependencies) {
    // We used to put react-scripts in devDependencies
    if (appPackage.devDependencies[ownPackageName]) {
      console.log(`  Removing ${cyan(ownPackageName)} from devDependencies`);
      delete appPackage.devDependencies[ownPackageName];
    }
  }
  appPackage.dependencies = appPackage.dependencies || {};
  if (appPackage.dependencies[ownPackageName]) {
    console.log(`  Removing ${cyan(ownPackageName)} from dependencies`);
    delete appPackage.dependencies[ownPackageName];
  }
  Object.keys(ownPackage.dependencies).forEach(key => {
    // For some reason optionalDependencies end up in dependencies after install
    if (ownPackage.optionalDependencies && ownPackage.optionalDependencies[key]) {
      return;
    }
    console.log(`  Adding ${cyan(key)} to dependencies`);
    appPackage.dependencies[key] = ownPackage.dependencies[key];
  });
  // Sort the deps
  const unsortedDependencies = appPackage.dependencies;
  appPackage.dependencies = {};
  Object.keys(unsortedDependencies)
    .sort()
    .forEach(key => {
      appPackage.dependencies[key] = unsortedDependencies[key];
    });
  console.log();

  console.log(cyan('Updating the scripts'));
  delete appPackage.scripts['eject'];
  Object.keys(appPackage.scripts).forEach(key => {
    Object.keys(ownPackage.bin).forEach(binKey => {
      const regex = new RegExp(binKey + ' (\\w+)', 'g');
      if (!regex.test(appPackage.scripts[key])) {
        return;
      }
      appPackage.scripts[key] = appPackage.scripts[key].replace(
        regex,
        'node scripts/$1.js'
      );
      console.log(
        `  Replacing ${cyan(`"${binKey} ${key}"`)} with ${cyan(
          `"node scripts/${key}.js"`
        )}`
      );
    });
  });

  fs.writeFileSync(
    path.resolve(root, 'package.json'), 
    JSON.stringify(appPackage, null, 2) + os.EOL, 
    { 
      encoding: 'utf-8' 
    }
  )

  staticResources.folder.forEach(folderName => {
    fs.copySync(path.resolve(scriptRoot, folderName), path.join(root, folderName))
  })

  staticResources.file.forEach(fileName => {
    fs.copyFileSync(path.resolve(scriptRoot, fileName), path.join(root, fileName))
  })
  
  console.log(green('Ejected successfully!'));
}

const run = () => {
  inquirer.prompt({
    type: 'confirm',
    name: 'shouldEject',
    message: 'Are you sure you want to eject? This action is permanent.',
    default: false,
  }).then(answer => {
    if (!answer.shouldEject) {
      console.log('Abort!')
      return
    }
    const folders = [
      'scripts',
      'config',
    ]
    const files = folders.reduce((files, folder) => {
      return files.concat(
        fs
          .readdirSync(path.join(scriptRoot, folder))
          .map(file => path.join(scriptRoot, folder, file))
          .filter(file => fs.lstatSync(file).isFile())
      );
    }, []);

    // Ensure that the app folder is clean and we won't override any files
    folders.forEach(verifyAbsent)
    files.forEach(verifyAbsent)

    console.log('Ejecting...');
    start()
  })
}

run()