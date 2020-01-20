module.exports = function(plop) {
    // create your generators here
    plop.setGenerator('bootstrap', {
        description: 'this is a skeleton plopfile',
        prompts: [
            {
                type: 'input',
                name: 'appName',
                message: 'Project name please'
            },
            {
                type: 'input',
                name: 'appTitle',
                message: 'Short name/identifier for the project please'
            },
            {
                type: 'input',
                name: 'appDescription',
                message: 'Describe the project please'
            },
            {
                type: 'input',
                name: 'appDname',
                message: 'Domain name please'
            },
            {
                type: 'input',
                name: 'appPort',
                message: 'Port Number of the project please'
            },
            {
                type: 'input',
                name: 'appVersion',
                message: 'Version Number of the project please',
                default: '1.0.0'
            }
        ],
        actions: [
            {
                type: 'modify',
                path: 'src/config/config.ts',
                pattern: /{{appTitle}}/g,
                template: '{{appTitle}}'
            },
            {
                type: 'modify',
                path: 'src/config/config.ts',
                pattern: /{{appDescription}}/g,
                template: '{{appDescription}}'
            },
            {
                type: 'modify',
                path: 'src/config/config.ts',
                pattern: /{{appDname}}/g,
                template: '{{camelCase appDname}}'
            },
            {
                type: 'modify',
                path: 'src/config/config.ts',
                pattern: /{{appPort}}/g,
                template: '{{appPort}}'
            },
            {
                type: 'modify',
                path: './.env',
                pattern: /{{appPort}}/g,
                template: '{{appPort}}'
            },
            {
                type: 'modify',
                path: './README.md',
                pattern: /{{appPort}}/g,
                template: '{{appPort}}'
            },
            {
                type: 'modify',
                path: 'kubernetes/deployment.yml',
                pattern: /{{appPort}}|{ { appPort } }/g,
                template: '{{appPort}}'
            },
            {
                type: 'modify',
                path: 'kubernetes/service.yml',
                pattern: /{{appPort}}|{ { appPort } }/g,
                template: '{{appPort}}'
            },
            {
                type: 'modify',
                path: './package.json',
                pattern: /{{appDescription}}/g,
                template: '{{appDescription}}'
            },
            {
                type: 'modify',
                path: './package.json',
                pattern: /{{appTitle}}/g,
                template: '{{camelCase appTitle}}'
            },
            {
                type: 'modify',
                path: './package.json',
                pattern: /{{appVersion}}/g,
                template: '{{appVersion}}'
            },
            {
                type: 'modify',
                path: './README.md',
                pattern: /{{appVersion}}/g,
                template: '{{appVersion}}'
            },
            {
                type: 'modify',
                path: './README.md',
                pattern: /{{appDname}}/g,
                template: '{{camelCase appDname}}'
            },
            {
                type: 'modify',
                path: './README.md',
                pattern: /{{appDescription}}/g,
                template: '{{appDescription}}'
            },
            {
                type: 'modify',
                path: './README.md',
                pattern: /{{appName}}/g,
                template: '{{appName}}'
            }
        ]
    });
};
