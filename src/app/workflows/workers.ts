// // import { log } from '../../utils/error.utils';
// import { createWorker, publishMessage } from '../utils/workflow.utils';
// // import { gqlRequest } from '../utils/graphql.utils';
// import { config } from '../../config/config';
// // import { gql } from 'apollo-server-express';

// // GET WORKERS ASSIGNED AND MAKE GQL CALL HERE TO THE RELEVANT SERVICE

// export const bootstrapWorkers = function() {
//     let workers = {
//         sum1: async function(job, complete) {
//             console.log('Variables:', job.variables);

//             let updatedWorkflowObj = {
//                 hello: 'world'
//             };

//             let res = await complete.success(updatedWorkflowObj);

//             console.log('Publishing sum1 completed....', res);

//             setTimeout(function() {
//                 publishMessage(
//                     {
//                         result: updatedWorkflowObj,
//                         instanceID: '1'
//                     },
//                     {
//                         correlationKey: '1',
//                         name: 'account-sum1-completed'
//                     }
//                 );
//             }, 3000);
//         },
//         product1: async function(job, complete) {
//             console.log(job.variables);

//             // let response = await gqlRequest(
//             //     `
//             // mutation testing {
//             //     testMutation(testID:"123",param1:"hello world",param2:{
//             //       value1: ${job.variables.payload.value1},
//             //       value2: ${job.variables.payload.value2}
//             //     }){
//             //       product
//             //     }
//             //   }
//             // `,
//             //     {}
//             // );

//             // console.log(response);let response = await gqlRequest(
//             //     `
//             // mutation testing {
//             //     testMutation(testID:"123",param1:"hello world",param2:{
//             //       value1: ${job.variables.payload.value1},
//             //       value2: ${job.variables.payload.value2}
//             //     }){
//             //       product
//             //     }
//             //   }
//             // `,
//             //     {}
//             // );

//             // console.log(response);

//             let updatedWorkflowObj = {
//                 hello1: 'world1'
//             };

//             await complete.success(updatedWorkflowObj);

//             publishMessage(
//                 {
//                     result: updatedWorkflowObj,
//                     instanceID: '1'
//                 },
//                 {
//                     correlationKey: '1',
//                     name: 'account-product1-completed'
//                 }
//             );
//         },
//         finalsum: async function(job, complete) {
//             console.log(job.variables);

//             // let response = await gqlRequest(
//             //     `
//             // mutation testing {
//             //     testMutation(testID:"123",param1:"hello world",param2:{
//             //       value1: ${job.variables.payload.value1},
//             //       value2: ${job.variables.payload.value2}
//             //     }){
//             //       finalsum
//             //     }
//             //   }
//             // `,
//             //     {}
//             // );

//             console.log(response);

//             let updatedWorkflowObj = {
//                 hello: 'world'
//             };

//             await complete.success(updatedWorkflowObj);
//         }
//     };

//     Object.keys(workers).forEach(function(taskType) {
//         createWorker(
//             global['wfe'][config.app.dname],
//             taskType,
//             workers[taskType],
//             {}
//         );
//     });
// };
