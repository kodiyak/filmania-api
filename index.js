const { readdirSync, readFileSync } = require('fs')
const files = readdirSync('.')
const modules = readdirSync('./node_modules')
const packageJson = JSON.parse(readFileSync('./package.json').toString())
// const apiModules = readdirSync('./apps/api')

console.log({ files, modules, packageJson })

setInterval(() => {
  console.log('NodeJS Process')
}, 1000)