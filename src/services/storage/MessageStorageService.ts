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
import MessageModel from '../../models/Message';

class MessageStorageService {
  async saveMessage(messageData: any): Promise<any> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return null;
    }

    try {
      const message = new MessageModel(messageData);
      return await message.save();
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error, update existing message
        return await MessageModel.findOneAndUpdate(
          { messageId: messageData.messageId, sessionName: messageData.sessionName },
          messageData,
          { new: true }
        );
      }
      throw error;
    }
  }

  async getMessageById(messageId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return null;
    }

    return await MessageModel.findOne({ messageId, sessionName });
  }

  async getMessagesByChatId(
    chatId: string,
    sessionName: string,
    options: { limit?: number; skip?: number; sort?: any } = {}
  ): Promise<any[]> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return [];
    }

    const query = MessageModel.find({ chatId, sessionName, isDeleted: false });

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    if (options.sort) query.sort(options.sort);
    else query.sort({ timestamp: -1 });

    return await query.exec();
  }

  async searchMessages(
    sessionName: string,
    searchText: string,
    options: { limit?: number; skip?: number } = {}
  ): Promise<any[]> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return [];
    }

    const query = MessageModel.find({
      sessionName,
      content: { $regex: searchText, $options: 'i' },
      isDeleted: false,
    });

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    query.sort({ timestamp: -1 });

    return await query.exec();
  }

  async updateMessageAck(
    messageId: string,
    sessionName: string,
    ack: number
  ): Promise<any> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return null;
    }

    return await MessageModel.findOneAndUpdate(
      { messageId, sessionName },
      { ack },
      { new: true }
    );
  }

  async deleteMessage(messageId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return null;
    }

    return await MessageModel.findOneAndUpdate(
      { messageId, sessionName },
      { isDeleted: true },
      { new: true }
    );
  }

  async getMessageCount(chatId: string, sessionName: string): Promise<number> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return 0;
    }

    return await MessageModel.countDocuments({ chatId, sessionName, isDeleted: false });
  }

  async getUnreadCount(chatId: string, sessionName: string): Promise<number> {
    if (!config.messageStorage?.enabled || !MessageModel) {
      return 0;
    }

    return await MessageModel.countDocuments({
      chatId,
      sessionName,
      fromMe: false,
      ack: { $lt: 3 },
      isDeleted: false,
    });
  }
}

export default new MessageStorageService();
