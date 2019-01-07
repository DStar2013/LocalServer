const Koa = require('koa');
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const upath = require("upath");
const watch = require("watch");

let apiList = [];
let apiMap = {};
let firstUpdate = true;
const app = new Koa();
const mockPath = path.resolve(__dirname, "mockdata");

function calcPath(dir) {
  return fs.readdirSync(dir).reduce((list, file) => {
    const fullPath = path.join(dir, file),
        isDir = fs.statSync(fullPath).isDirectory();
    return list.concat(isDir ? calcPath(fullPath) : [fullPath.replace(/\.js$/, '')]);
  }, []);
}

function syncMockData() {
  apiList = calcPath(mockPath).map(file => upath.normalizeSafe(file.split(mockPath).pop()));
  apiMap = apiList.reduce((map, item) => {
    map[item.toLowerCase()] = item;
    return map;
  }, {});
  if (firstUpdate) {
    firstUpdate = false;
  } else {
    console.log(chalk.green('Mock data updated.'));
  }
}

function readSource(file) {
  const relativePath = `./mockdata${file}`;
  delete require.cache[require.resolve(relativePath)];
  const result = require(relativePath);
  return typeof result === 'function' ? result : () => result;
}

watch.watchTree(mockPath, {
  interval: 3
}, syncMockData);

app.use(async (ctx, next) => {
  const p = ctx.path.replace(/\/$/, '').toLowerCase();

  if (apiMap[p]) {
    const data = readSource(apiMap[p])(ctx);
    ctx.body = data;
    ctx.set('Content-Type', 'application/json;charset=utf-8');
    ctx.set("Access-Control-Allow-Origin", ctx.request.header.origin)
    ctx.set('Access-Control-Allow-Credentials', true);
    ctx.set('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
    console.log(chalk.yellow(`\n 😲  ==> ${p}`));
    console.log(chalk.green(' 🤗  <== 200'));
  }
  await next();
});
//port 
app.listen(30000);
console.log(`\n==> 🌎  Listening on port 30000. \n`);


