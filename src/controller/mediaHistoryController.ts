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
import MediaStorageService from '../services/storage/MediaStorageService';

/**
 * Get all stored media for a session
 */
export async function getAllStoredMedia(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Media History"]
   * #swagger.summary = "Get all stored media"
   * #swagger.description = "Retrieve all media metadata stored in the database for a session"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["limit"] = { in: 'query', type: 'number', description: 'Limit number of results' }
   * #swagger.parameters["skip"] = { in: 'query', type: 'number', description: 'Skip number of results' }
   * #swagger.parameters["mimeType"] = { in: 'query', type: 'string', description: 'Filter by mime type (e.g., image, video)' }
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
    const mimeType = req.query.mimeType as string;

    const media = await MediaStorageService.getAllMedia(session, {
      limit,
      skip,
      mimeType,
    });

    res.status(200).json({
      status: 'success',
      response: media,
      count: media.length,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving media',
      error: error.message,
    });
  }
}

/**
 * Get media by message ID
 */
export async function getMediaByMessageId(req: Request, res: Response) {
  /**
   * #swagger.tags = ["Media History"]
   * #swagger.summary = "Get media by message ID"
   * #swagger.description = "Retrieve media metadata for a specific message"
   * #swagger.security = [{"bearerAuth": []}]
   * #swagger.parameters["session"] = { schema: 'NERDWHATS_AMERICA' }
   * #swagger.parameters["messageId"] = { in: 'path', required: true, description: 'Message ID' }
   */
  if (!config.messageStorage?.enabled) {
    return res.status(400).json({
      status: 'error',
      message: 'Message storage is not enabled',
    });
  }

  try {
    const { session, messageId } = req.params;

    const media = await MediaStorageService.getMediaByMessageId(messageId, session);

    if (!media) {
      return res.status(404).json({
        status: 'error',
        message: 'Media not found',
      });
    }

    res.status(200).json({
      status: 'success',
      response: media,
    });
  } catch (error: any) {
    req.logger.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving media',
      error: error.message,
    });
  }
}
