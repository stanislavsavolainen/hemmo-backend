'use strict';

import Promise from 'bluebird';
import Boom from 'boom';
import _ from 'lodash';
import db from '../db';
import letterCase from './letterCaseUtil';

module.exports = {
  findAllBy,
  findOneBy,
  findById,
  insertWithTimestamps,
  updateWithTimestamps,
  insertAndReturn,
  updateAndReturn,
  modelify,
  dbify,
  single,
  exists,
  existsCaseInsensitiveForColumn
};

// guards a unary function fn so that it is only called when the passed
// argument is an object that is not an error - otherwise passes the argument
// through as is
function passthrough(argument, fn) {
  if (!_.isObject(argument) ||
    argument.isBoom ||
    argument instanceof Error) {
    return argument;
  }

  return fn(argument);
}

function findAllBy(table, query) {
  return db(table)
    .select()
    .where(dbify(query))
    .then(rows => rows.map(modelify));
}

function findOneBy(table, query) {
  return db(table)
    .first()
    .where(dbify(query))
    .then(modelify);
}

function findById(table, id) {
  return findOneBy(table, {id: +id});
}

function postgresExistsTransformation(countResult) {
  // Postgres specific implementation, it returns a string instead of number
  // More info: https://github.com/tgriesser/knex/issues/387
  return (countResult.count === '0' || countResult.count === 0) ? false : true;
}

function exists(table, query) {
  return db(table)
    .count('*')
    .where(dbify(query))
    .first()
    .then(postgresExistsTransformation);
}

function existsCaseInsensitiveForColumn(table, column, value, idToExclude) {
  let query = db(table)
    .count('*')
    .whereRaw(`LOWER(${dbify(column)}) = ?`, value.toLowerCase());

  if (idToExclude && _.isNumber(idToExclude)) {
    query = query.andWhereNot('id', idToExclude);
  }

  return query
    .first()
    .then(postgresExistsTransformation);
}

function insertWithTimestamps(table, model) {
  if (model.id) {
    return Promise.reject('Cannot insert entity to ' + table +
      'because the entity already has an id:' + JSON.stringify(model));
  }

  return db(table)
    .returning('id')
    .insert(timestamp(dbify(model)))
    .then(createdIds => {
      if (!createdIds || createdIds.length !== 1) {
        throw new Error(
          `Insert failed, expected to receive created entity id, received ${createdIds}`);
      }
      return createdIds[0];
    })
    .catch((error) => {
      // This part is a bit sketchy as it turns a failing promise into
      // a successful promise that contains an error
      console.log('Failed to insert entity to ' + table + ': ' + error);
      return error;
    });
}

function updateWithTimestamps(table, model) {
  const id = model.id;

  if (!id) {
    return Promise.reject('Cannot update entity in ' + table +
      'because the entity is missing an id:' + JSON.stringify(model));
  }

  return db(table)
    .where('id', id)
    .update(timestamp(dbify(model)))
    .then(rowsUpdated => {
      if (!rowsUpdated) {
        throw new Error(`Update failed, record by ${id} does not exist in ${table}`);
      }
      return id;
    });
}

function insertAndReturn(table, model) {
  return insertWithTimestamps(table, model)
    .then(id => findById(table, id));
}

function updateAndReturn(table, model) {
  return updateWithTimestamps(table, model)
    .then(id => findById(table, id));
}

function timestamp(record) {
  if (record && (record.createdAt || record.updatedAt)) {
    throw new Error('queryMapper.timestamp should be called with a database record, ' +
    'not a model object. Consider passing model through `dbify` before timstamping');
  }

  const now = new Date();

  record.updated_at = now;

  // if entity has an id, its created_at value should not be overridden
  if (!record.id) {
    record.created_at = now;
  }

  return record;
}

/**
 * Converts a database record object to a API-friendly return object.
 *
 * This method should be called for all db records before reply(), given
 * the record is not explicitly formatted as a part of the query or query
 * callback.
 *
 * @param {Object} record Object returned from a db query, or a Boom error
 *
 * @returns {Object} Formatted model object, or Boom as-is
 */
function modelify(record) {
  return passthrough(record, letterCase.camelKeys);
}

/**
 * Converts a model object to DB-friendly record object
 *
 * Reverse of modelify.
 *
 * @param {Object} record Object ready to be inserted/updated to the database
 *
 * @returns {Object} Formatted record object
 */
function dbify(model) {
  return passthrough(model, letterCase.underscoreKeys);
}

function single(records) {
  if (!records || records.length === 0) {
    return Boom.notFound();
  }

  if (records.length > 1) {
    return Boom.badImplementation('Query returned too many records. ' +
      'Expected one, received:' + records);
  }

  return records[0];
}