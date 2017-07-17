import Boom from 'boom';

import {
  dbGetFeedback,
  dbGetSingleFeedback,
  dbDelFeedback,
  dbUpdateFeedback,
  dbCreateFeedback,
} from '../models/feedback';

import { countAndPaginate } from '../utils/db';

export const getFeedback = (request, reply) =>
  countAndPaginate(
    dbGetFeedback(request.query),
    request.query.limit,
    request.query.offset,
  ).then(reply);

export const getSingleFeedback = (request, reply) =>
  dbGetSingleFeedback(request.params.feedbackId).then(reply);

export const delFeedback = (request, reply) =>
  dbDelFeedback(request.params.feedbackId).then(reply);

export const updateFeedback = (request, reply) =>
  dbUpdateFeedback(request.params.feedbackId, request.payload).then(reply);

export const createFeedback = (request, reply) =>
  dbCreateFeedback(request.pre.employee.id)
    .then(reply)
    .catch(err => reply(Boom.badImplementation(err)));

export const handler1 = (request, reply) => {
  console.log('************POST*****************');
  console.log(`-------> handler function params : ${request.payload1}`);
  console.log(`-------> handler function params : ${request.payload.data1}`);
  // payload  , request.params

  Object.keys(request.payload).forEach(key =>
    console.log(request.payload[key]),
  );

  return reply();
};

export const handler2 = (request, reply) => {
  console.log('*************GET****************');
  console.log(`-------> handler2 function params : ${request.query}`);
  // console.log(`=======> handler2 function value : ${request.query.data1}`);
  console.log(
    `value1 : ${request.query.data1}  value2 : ${request.query
      .data2} value3: ${request.query.data3}`,
  );

  Object.keys(request.query).forEach(key => console.log(request.query[key]));

  // for (const i in request.query) { console.log(`  ${i}`); }

  // payload  , request.params
  return reply(JSON.stringify('some-interesting-data'));
};

export const handler3 = (request, reply) => {
  // containAndPaginate = knex function in this file only

  // dbCreateFeedback('b06650a9-adae-4356-805c-77bbfd319c04'); // foobar user-id

  return reply();
};
