import uuid from 'uuid/v4';
import knex, { likeFilter, exactFilter } from '../utils/db';

export const dbGetChildren = filters =>
  knex('children')
    .select([
      'children.*',
      'employees.name as assigneeName',
      'prevFeedback.prevFeedbackDate',
    ])
    .where(
      likeFilter({
        'children.name': filters.name,
        'employees.name': filters.assigneeName,
      }),
    )
    .andWhere(
      exactFilter({
        assigneeId: filters.assigneeId,
      }),
    )
    .leftOuterJoin('employees', 'children.assigneeId', 'employees.id')
    // Previous feedback
    .leftOuterJoin(
      knex('feedback')
        .select(['createdAt as prevFeedbackDate', 'childId'])
        .orderBy('createdAt', 'desc')
        .as('prevFeedback'),
      'children.id',
      'prevFeedback.childId',
    )
    .orderBy(filters.orderBy || 'children.name', filters.order);

export const dbGetChild = id =>
  knex('children')
    .first([
      'children.*',
      'employees.name as assigneeName',
      'prevFeedback.prevFeedbackDate',
    ])
    .where({ 'children.id': id })
    .leftOuterJoin('employees', 'children.assigneeId', 'employees.id')
    // Previous feedback
    .leftOuterJoin(
      knex('feedback')
        .select(['createdAt as prevFeedbackDate', 'childId'])
        .orderBy('createdAt', 'desc')
        .as('prevFeedback'),
      'children.id',
      'prevFeedback.childId',
    );

export const dbDelChild = id => knex('children').del().where({ id });

export const dbCreateChild = fields =>
  knex('children')
    .insert({
      ...fields,
      id: uuid(),
    })
    .returning(['id', 'assigneeId', 'name'])
    .then(results => results[0]);

export const dbUpdateChild = (id, fields) =>
  knex('children')
    .update(fields)
    .where({ id })
    .returning(['id', 'assigneeId', 'name'])
    .then(results => results[0]);
