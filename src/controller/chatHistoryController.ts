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
import ChatStorageService from '../services/storage/ChatStorageService';
import MessageStorageService from '../services/storage/MessageStorageService';

/**
 * Get all chats for a session
 */
export async function getAllStoredChats(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Chat History"]
   * #swagger.summary = "Get all stored chats"
   * #swagger.description = "Retrieve all chats stored in the database for a session"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["limit"] = { in: 'query', type: 'number', description: 'Limit number of results' }
   * #swagger.parameters["skip"] = { in: 'query', type: 'number', description: 'Skip number of results' }
   * #swagger.parameters["archived"] = { in: 'query', type: 'boolean', description: 'Filter archived chats' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;
    const archived = req.query.archived === 'true';

    const chats = await ChatStorageService.getAllChats(session, {
      limit,
      skip,
      archived,
    });

    res.status(200).json({
      status: 'success',
      response: chats,
      count: chats.length,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving chats',
      error: error.message,
    });
  }
}

/**
 * Get a specific chat by ID
 */
export async function getChatById(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Chat History"]
   * #swagger.summary = "Get chat by ID"
   * #swagger.description = "Retrieve a specific chat by chat ID"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["chatId"] = { in: 'path', required: true, description: 'Chat ID' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session, chatId } = req.params;

    const chat = await ChatStorageService.getChatById(chatId, session);

    if (!chat) {
      return res.status(404).json({
        status: 'error',
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      status: 'success',
      response: chat,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving chat',
      error: error.message,
    });
  }
}

/**
 * Get messages from a specific chat
 */
export async function getChatMessages(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Chat History"]
   * #swagger.summary = "Get chat messages"
   * #swagger.description = "Retrieve messages from a specific chat"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["chatId"] = { in: 'path', required: true, description: 'Chat ID' }
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
    const { session, chatId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const messages = await MessageStorageService.getMessagesByChatId(
      chatId,
      session,
      { limit, skip }
    );

    const count = await MessageStorageService.getMessageCount(chatId, session);

    res.status(200).json({
      status: 'success',
      response: {
        messages,
        total: count,
        limit,
        skip,
      },
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving messages',
      error: error.message,
    });
  }
}

/**
 * Search messages across all chats
 */
export async function searchMessages(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Chat History"]
   * #swagger.summary = "Search messages"
   * #swagger.description = "Search for messages across all chats"
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

    const messages = await MessageStorageService.searchMessages(session, query, {
      limit,
      skip,
    });

    res.status(200).json({
      status: 'success',
      response: messages,
      count: messages.length,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error searching messages',
      error: error.message,
    });
  }
}

/**
 * Get chat statistics
 */
export async function getChatStats(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Chat History"]
   * #swagger.summary = "Get chat statistics"
   * #swagger.description = "Get statistics for a specific chat"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["chatId"] = { in: 'path', required: true, description: 'Chat ID' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session, chatId } = req.params;

    const messageCount = await MessageStorageService.getMessageCount(
      chatId,
      session
    );
    const unreadCount = await MessageStorageService.getUnreadCount(
      chatId,
      session
    );

    res.status(200).json({
      status: 'success',
      response: {
        chatId,
        messageCount,
        unreadCount,
      },
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving chat statistics',
      error: error.message,
    });
  }
}
