import { merge } from 'lodash';
import Joi from 'joi';

import { getAuthWithScope, doAuth } from '../../utils/auth';
import {
  getUsers,
  getUser,
  updateUser,
  delUser,
  authUser,
  registerUser,
} from '../../handlers/users';

const validateUserId = {
  validate: {
    params: {
      userId: Joi.number().integer().required(),
    },
  },
};

const validateRegistrationFields = {
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  },
};

const users = [
  // Get a list of all users
  {
    method: 'GET',
    path: '/admin/users',
    config: getAuthWithScope('user'),
    handler: getUsers,
  },

  // Get info about a specific user
  {
    method: 'GET',
    path: '/admin/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('user')),
    handler: getUser,
  },

  // Update user profile
  {
    method: 'PATCH',
    path: '/admin/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('user')),
    handler: updateUser,
  },

  // Delete a user, admin only
  {
    method: 'DELETE',
    path: '/admin/users/{userId}',
    config: merge({}, validateUserId, getAuthWithScope('admin')),
    handler: delUser,
  },

  // Authenticate as user
  {
    method: 'POST',
    path: '/admin/users/authenticate',
    config: doAuth,
    handler: authUser,
  },

  // Register new user
  {
    method: 'POST',
    path: '/admin/users',
    config: validateRegistrationFields,
    handler: registerUser,
  },
];

export default users;

// Here we register the routes
export const routes = server => server.route(users);