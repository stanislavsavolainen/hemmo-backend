import Boom from 'boom';

import {
  dbGetFeedback,
  dbGetSingleFeedback,
  dbDelFeedback,
  dbUpdateFeedback,
  dbCreateFeedback,
  dbGetFeedbackGivenMoods,
} from '../models/feedback';

import knex, { countAndPaginate } from '../utils/db';
import uuid from 'uuid/v4';
import { dbGetChild } from './children';

export const getFeedback = (request, reply) =>
  countAndPaginate(
    dbGetFeedback(request.query),
    request.query.limit,
    request.query.offset,
  ).then(reply);

export const getFeedbackGivenMoods = (request, reply) => {
  countAndPaginate(
    dbGetFeedbackGivenMoods(request.query),
    request.query.limit,
    request.query.offset,
  ).then(reply);
};

export const getSingleFeedback = (request, reply) =>
  dbGetSingleFeedback(request.params.feedbackId).then(reply);

export const delFeedback = (request, reply) =>
  dbDelFeedback(request.params.feedbackId).then(reply);

export const updateFeedback = (request, reply) =>
  dbUpdateFeedback(request.params.feedbackId, request.payload).then(reply);


export const createFeedback = (request, reply) =>
  dbCreateFeedback(request.pre.employee.id, request.payload)
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

  //return reply(JSON.stringify('some-interesting-data1'));
  return reply(JSON.stringify('------*****-----========'));
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
  return reply(JSON.stringify('some-interesting-data2'));
};

export const handler3 = (request, reply) => {
  console.log('Handler 3 executed .');

  console.log(`payload mood :${request.payload.mood}`);
  console.log(`payload acitivity -> main : ${request.payload.activities.main}`);
  console.log(`payload acitivity -> sub : ${request.payload.activities.sub}`);
  console.log(`payload acitivity -> like : ${request.payload.activities.like}`);

  Object.keys(request.payload).forEach(key =>
    console.log(request.payload[key]),
  );

  console.log(
    ` *******> ${request.payload.mood} , ${request.payload.activities
      .main} , ${request.payload.activities.sub} , ${request.payload.activities
      .like}`,
  );

  const childId = 'f0aef70f-0487-4d2f-9d3e-f9dfee4f3a5e';
  // const child = dbGetChild(childId);

  knex('feedback')
    .insert({
      id: uuid(),
      childId,
      // assigneeId: child.assigneeId,
      activities: request.payload.activities,
      moods: request.payload.mood,
    })
    .returning('*')
    .then(results => results[0]);

  return reply(JSON.stringify('123'));
};

export const handler4 = (request, reply) => {
  let a = request.payload.data1;
  console.log('********************** handler 4 , and payload : ' + a);
  return reply(JSON.stringify('hanlder4 ' + a));
};

export const handler5 = (request, reply) => {
  let a = request.payload.data1;

  let myarray = [];
  myarray = JSON.stringify(a).split(',');
  //myarray = JSON.stringify(a);

  console.log('--------> handler 5 ' + JSON.stringify(a, null, 2));

  console.log(' -> ' + myarray[5]);

  /*
  address + @ + domain + . + lang 

                              lang = com , org, fi

  myaddress@domain.com

a.com@myadress.b

  email_mark = taulukko.split('@').length == 2
  address = "myaddress@domain.com"
  is_valid_address = address.match("[a-z0-9\._]+@[a-z0-9_]+\.[a-z0-9_]+") != null;

  email_mark = false;
  amout_of_marks = 0;
for ( taulukko.lenght)
  if(taulukko[indeksi] === "@") email_mark = true; amout_of_marks ++;


if(e_mail && amout_of_marks === 1)


  mark []= a, b, c  


  var login_txt

  if(login_txt.lenght > 6 && login_text.lenght < 20)


    login : admin
    password : ?????
    
    a-z A-Z 0-9   -> 50
    aa

    symbol = a .... z , A .... Z, 1 .... 9

    50 exp 8   
    temp_password += symbol

    if( authenticate (temp_password) 

password = "salasana"
sha256(password + "12345zxfczxczxc")



sha256(temp_password) == dbpassword
*/

  //for (let i = 0; i < myarray.length; i++) console.log(i + ' :  ' + myarray[i].replace(/[^a-zA-Z0-9]/g, ''));

  return reply(JSON.stringify('handler 5' + myarray));
};

export const handler6 = (request, reply) => {};

// containAndPaginate = knex function in this file only

// dbCreateFeedback('b06650a9-adae-4356-805c-77bbfd319c04'); // foobar user-id
