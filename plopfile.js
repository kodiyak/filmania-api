const { upperFirst } = require('lodash');
const camelCase = require('lodash.camelcase');
const kebabCase = require('lodash.kebabcase');
const fs = require('fs');
const path = require('path');

const appsNames = fs.readdirSync('./apps')
// const dirNames = fs.readdirSync('./apps/api/src/modules')

// plopfile.js
module.exports = function (
  /** @type {import('plop').NodePlopAPI} */
  plop
) {

  for (const appName of appsNames) {
    let dirNames = []
    try {
      dirNames = fs.readdirSync(`./apps/${appName}/src/modules`)
    } catch (error) {

    }
    // plop generator code
    plop.setGenerator(`make:usecase ${appName}`, {
      description: "application controller logic",
      prompts: [
        {
          type: 'list',
          name: 'moduleName',
          choices: dirNames.map((dirName) => ({
            name: dirName,
            value: dirName
          }))
        },
        {
          type: 'list',
          name: 'serviceType',
          choices: [
            { name: 'command', value: 'command' },
            { name: 'query', value: 'query' },
          ]
        },
        {
          type: 'text',
          name: 'serviceName',
        },
        {
          type: 'text',
          name: 'eventNames',
        }
      ],
      actions: ({ moduleName, serviceType, serviceName, eventNames }) => {
        // console.log({ moduleName, serviceName, eventNames })
        const events = eventNames.split(',').map((v) => v.trim())
        const methodName = `${camelCase(kebabCase(serviceName).split('-')[0])}`
        const classServiceName = `${upperFirst(camelCase(serviceName))}`
        const serviceFilename = `${kebabCase(serviceName)}`


        const eventFiles = []
        const data = {
          controllerFilename: `${serviceFilename}.http.controller`,
          controllerName: `${classServiceName}HttpController`,
          controllerMethod: `${methodName}`,
          commandName: `${classServiceName}Command`,
          commandFilename: `${serviceFilename}.command`,
          queryName: `${classServiceName}Query`,
          queryFilename: `${serviceFilename}.query`,
          useCaseName: `${classServiceName}`,
          useCaseVariable: `${camelCase(serviceName)}`,
          useCaseMethod: `${methodName}`,
          useCaseFilename: `${serviceFilename}`,
        }


        if (events.filter((v) => !!v).length > 0) {
          console.log(plop.renderString(`Go to: apps/api/src/start/load_dispatchers.ts`))
          console.log(plop.renderString(`Paste...`))
          for (const event of events) {
            const eventFolder = `${kebabCase(event)}-${serviceFilename}`
            const eventFilename = `${kebabCase(event)}-${serviceFilename}.event`
            const eventName = `${upperFirst(camelCase(event))}${classServiceName}Event`
            const eventHandlerFilename = `${kebabCase(event)}-${serviceFilename}.handler`
            const eventHandlerName = `${upperFirst(camelCase(event))}${classServiceName}EventHandler`

            const eventLines = [
              ``,
              `makeDispatcherService().register(`,
              `  ${eventName},`,
              `  new ${eventHandlerName}()`,
              `);`,
            ]

            console.log(plop.renderString(eventLines.join('\n')))

            // console.log({ eventFolder, eventFilename, eventName, eventHandlerFilename, eventHandlerName })

            eventFiles.push({
              type: "add",
              path: "apps/api/src/modules/{{moduleName}}/events/{{eventFolder}}/{{eventFilename}}.ts",
              templateFile: "./.plop/api/event.hbs",
              force: false,
              data: {
                ...data,
                eventFolder,
                eventFilename,
                eventName,
                eventHandlerFilename,
                eventHandlerName,
              },
            })
            eventFiles.push({
              type: "add",
              path: "apps/api/src/modules/{{moduleName}}/events/{{eventFolder}}/{{eventHandlerFilename}}.ts",
              templateFile: "./.plop/api/event-handler.hbs",
              force: false,
              abortOnFail: false,
              data: {
                ...data,
                eventFolder,
                eventFilename,
                eventName,
                eventHandlerFilename,
                eventHandlerName,
              },
            })
          }
        }

        // console.log(data)

        console.log(plop.renderString(`\n\n----------------\nGo to: apps/api/src/modules/${moduleName}/index.ts`))
        console.log(plop.renderString(`Paste...`))

        const moduleIndexLines = [
          ``,
          `import { ${data.controllerName} } from "./controllers/${data.controllerFilename}";`,
          `import { ${data.useCaseName} } from "./use-cases/${data.useCaseFilename}";`,
          ``,
          `export const make${data.useCaseName} = () => {`,
          `  return new ${data.useCaseName}(makeDispatcherService());`,
          `};`,

          ``,
          `export const make${data.controllerName} = () => {`,
          `  return new ${data.controllerName}(`,
          `    make${data.useCaseName}()`,
          `  );`,
          `};`,
          ``,
          `----------------`,
          ``,
        ]
        console.log(plop.renderString(moduleIndexLines.join(`\n`)))

        const filesByServiceType = []

        if (serviceType === 'command') {
          filesByServiceType.push({
            type: "add",
            path: "apps/api/src/modules/{{moduleName}}/commands/{{commandFilename}}.ts",
            templateFile: "./.plop/api/command.hbs",
            force: false,
            data,
            abortOnFail: false,
          })
        } else {
          filesByServiceType.push({
            type: "add",
            path: "apps/api/src/modules/{{moduleName}}/queries/{{queryFilename}}.ts",
            templateFile: "./.plop/api/query.hbs",
            force: false,
            data,
            abortOnFail: false,
          })

        }

        return [
          {
            type: "add",
            path: "apps/api/src/modules/{{moduleName}}/controllers/{{controllerFilename}}.ts",
            templateFile: "./.plop/api/controller.hbs",
            data,
            abortOnFail: false,
          },
          {
            type: "add",
            path: "apps/api/src/modules/{{moduleName}}/use-cases/{{useCaseFilename}}.ts",
            templateFile: "./.plop/api/use-case.hbs",
            force: false,
            data,
            abortOnFail: false,
          },
          ...filesByServiceType,
          ...eventFiles,
        ]
      },
    });
  }


}
