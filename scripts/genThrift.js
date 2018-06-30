const config = require('config');
const path = require('path');
const root = config.get('root');
const thriftTs = require('thrift-ts').default;
const glob = require('glob');
const fs = require('mz/fs');
const genThrift = require('@mtfe/gen-thrift');

const compilerOptions = {
  tabSize: 2,
  spaceAsTab: true,
  int64AsString: true,
}

const dir = path.join(root, 'src', 'server', 'thrift')
const source = path.join(dir, 'src');
const out = path.join(dir, 'dist');

async function genThriftJS() {
  await genThrift({
    dir,
    targets: './src/Service.thrift',
    includes: ['./src/Model.thrift'],
    dest: './dist',
    source: false
  })
}

async function genThriftDTS() {
  const pattern = path.join(source, '*.thrift')

  const files = await new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });

  await Promise.all(files.map(async file => {
    const files = thriftTs({
      filename: file,
      content: await fs.readFile(file)
    }, compilerOptions);
    files.forEach(file => {
      console.log(path.join(out, file.filename));
      fs.writeFileSync(path.join(out, file.filename), file.content);
    })
  }));
}

genThriftJS().then(genThriftDTS);
