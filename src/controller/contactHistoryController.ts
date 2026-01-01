/*
 * Copyright 2021 WPPConnect Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Request, Response } from 'express';

import config from '../config';
import ContactStorageService from '../services/storage/ContactStorageService';

/**
 * Get all stored contacts for a session
 */
export async function getAllStoredContacts(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Contact History"]
   * #swagger.summary = "Get all stored contacts"
   * #swagger.description = "Retrieve all contacts stored in the database for a session"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["limit"] = { in: 'query', type: 'number', description: 'Limit number of results' }
   * #swagger.parameters["skip"] = { in: 'query', type: 'number', description: 'Skip number of results' }
   * #swagger.parameters["blocked"] = { in: 'query', type: 'boolean', description: 'Filter blocked contacts' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session } = req.params;
    const limit = parseInt(req.query.limit as string) || 100;
    const skip = parseInt(req.query.skip as string) || 0;
    const isBlocked = req.query.blocked === 'true' ? true : req.query.blocked === 'false' ? false : undefined;

    const contacts = await ContactStorageService.getAllContacts(session, {
      limit,
      skip,
      isBlocked,
    });

    res.status(200).json({
      status: 'success',
      response: contacts,
      count: contacts.length,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving contacts',
      error: error.message,
    });
  }
}

/**
 * Get a specific contact by ID
 */
export async function getStoredContactById(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Contact History"]
   * #swagger.summary = "Get contact by ID"
   * #swagger.description = "Retrieve a specific contact by contact ID"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["contactId"] = { in: 'path', required: true, description: 'Contact ID' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session, contactId } = req.params;

    const contact = await ContactStorageService.getContactById(contactId, session);

    if (!contact) {
      return res.status(404).json({
        status: 'error',
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 'success',
      response: contact,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving contact',
      error: error.message,
    });
  }
}

/**
 * Search contacts
 */
export async function searchStoredContacts(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Contact History"]
   * #swagger.summary = "Search contacts"
   * #swagger.description = "Search for contacts by name or number"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["query"] = { in: 'query', required: true, type: 'string', description: 'Search query' }
   * #swagger.parameters["limit"] = { in: 'query', type: 'number', description: 'Limit number of results' }
   * #swagger.parameters["skip"] = { in: 'query', type: 'number', description: 'Skip number of results' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session } = req.params;
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    if (!query) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required',
      });
    }

    const contacts = await ContactStorageService.searchContacts(session, query, {
      limit,
      skip,
    });

    res.status(200).json({
      status: 'success',
      response: contacts,
      count: contacts.length,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching contacts',
      error: error.message,
    });
  }
}
