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
import config from '../../config';
import MediaModel from '../../models/Media';

class MediaStorageService {
  async saveMedia(mediaData: any): Promise<any> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return null;
    }

    try {
      const media = new MediaModel(mediaData);
      return await media.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error, update existing
        return await MediaModel.findOneAndUpdate(
          { mediaId: mediaData.mediaId },
          mediaData,
          { new: true }
        );
      }
      throw error;
    }
  }

  async getMediaById(mediaId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return null;
    }

    return await MediaModel.findOne({ mediaId, sessionName });
  }

  async getMediaByMessageId(messageId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return null;
    }

    return await MediaModel.findOne({ messageId, sessionName });
  }

  async getAllMedia(
    sessionName: string,
    options: { limit?: number; skip?: number; mimeType?: string } = {}
  ): Promise<any[]> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return [];
    }

    const filter: any = { sessionName };
    if (options.mimeType) {
      filter.mimeType = { $regex: options.mimeType, $options: 'i' };
    }

    const query = MediaModel.find(filter);

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    query.sort({ createdAt: -1 });

    return await query.exec();
  }

  async updateMediaDownloadStatus(
    mediaId: string,
    sessionName: string,
    isDownloaded: boolean
  ): Promise<any> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return null;
    }

    return await MediaModel.findOneAndUpdate(
      { mediaId, sessionName },
      { isDownloaded },
      { new: true }
    );
  }

  async deleteMedia(mediaId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return null;
    }

    return await MediaModel.findOneAndDelete({ mediaId, sessionName });
  }

  async getMediaCount(sessionName: string): Promise<number> {
    if (!config.messageStorage?.enabled || !MediaModel) {
      return 0;
    }

    return await MediaModel.countDocuments({ sessionName });
  }
}

export default new MediaStorageService();
