const { BpmnParser } = require('zeebe-node');

/**
 * TEST FN
 */
async function test() {
    let definitions = await BpmnParser.generateConstantsForBpmnFiles(
        './src/app/workflows/arithmetic-operations.bpmn'
    );

    console.log(definitions);

    return definitions;
}

test();

export {};
