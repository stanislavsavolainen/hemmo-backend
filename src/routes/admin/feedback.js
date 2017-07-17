import Joi from 'joi';

import { getAuthWithScope } from '../../utils/auth';
import {
  getFeedback,
  getSingleFeedback,
  updateFeedback,
  delFeedback,
  // my handler object (export functions from )
  handler1,
  handler2,
} from '../../handlers/feedback';

const feedbackId = {
  params: {
    feedbackId: Joi.string().required(),
  },
};

const editProfileFields = {
  payload: {
    assigneeId: Joi.string().required(),
  },
};

const filters = {
  query: {
    assigneeName: Joi.string().allow(''),
    assigneeId: Joi.string().allow(''),
    childName: Joi.string().allow(''),
    childId: Joi.string().allow(''),
    order: Joi.string().allow('asc', 'desc'),
    orderBy: Joi.string().allow('childName', 'createdAt', 'assigneeName'),
    limit: Joi.number().integer(),
    offset: Joi.number().integer(),
    reviewed: Joi.bool(),
  },
};

const routeConfigs = [
  // Get a list of all feedback
  {
    method: 'GET',
    path: '/admin/feedback',
    handler: getFeedback,
    config: {
      validate: filters,
      ...getAuthWithScope('employee'),
    },
  },

  // Get info about a specific feedback session
  {
    method: 'GET',
    path: '/admin/feedback/{feedbackId}',
    handler: getSingleFeedback,
    config: {
      validate: feedbackId,
      ...getAuthWithScope('employee'),
    },
  },

  // Update feedback session data
  {
    method: 'PATCH',
    path: '/admin/feedback/{feedbackId}',
    handler: updateFeedback,
    config: {
      validate: {
        ...feedbackId,
        ...editProfileFields,
      },
      ...getAuthWithScope('employee'),
    },
  },

  // Delete feedback session
  {
    method: 'DELETE',
    path: '/admin/feedback/{feedbackId}',
    handler: delFeedback,
    config: {
      validate: feedbackId,
      ...getAuthWithScope('admin'),
    },
  },

  {
    method: 'POST',
    path: '/data_to_server1',
    handler: handler1,
  },
  {
    method: 'GET',
    path: '/data_to_server2',
    handler: handler2,
  },
  /* write data to postgres content table, when createContent handler function happen.
     New version of backend have diffrent database so content table probaply isn't excisted anymore
     
  {
    method: 'POST',
    path: '/data_to_server3',
    handler: createContent,
  },
*/
];

export default routeConfigs;

// Here we register the routes
export const routes = server => server.route(routeConfigs);
