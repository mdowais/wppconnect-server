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
import ChatModel from '../../models/Chat';

class ChatStorageService {
  async saveOrUpdateChat(chatData: any): Promise<any> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return null;
    }

    try {
      return await ChatModel.findOneAndUpdate(
        { chatId: chatData.chatId, sessionName: chatData.sessionName },
        chatData,
        { new: true, upsert: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getChatById(chatId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return null;
    }

    return await ChatModel.findOne({ chatId, sessionName });
  }

  async getAllChats(
    sessionName: string,
    options: { limit?: number; skip?: number; archived?: boolean } = {}
  ): Promise<any[]> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return [];
    }

    const filter: any = { sessionName };
    if (options.archived !== undefined) {
      filter.isArchived = options.archived;
    }

    const query = ChatModel.find(filter);

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    query.sort({ 'lastMessage.timestamp': -1 });

    return await query.exec();
  }

  async updateLastMessage(
    chatId: string,
    sessionName: string,
    lastMessage: any
  ): Promise<any> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return null;
    }

    return await ChatModel.findOneAndUpdate(
      { chatId, sessionName },
      { lastMessage },
      { new: true }
    );
  }

  async updateUnreadCount(
    chatId: string,
    sessionName: string,
    unreadCount: number
  ): Promise<any> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return null;
    }

    return await ChatModel.findOneAndUpdate(
      { chatId, sessionName },
      { unreadCount },
      { new: true }
    );
  }

  async archiveChat(
    chatId: string,
    sessionName: string,
    isArchived: boolean
  ): Promise<any> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return null;
    }

    return await ChatModel.findOneAndUpdate(
      { chatId, sessionName },
      { isArchived },
      { new: true }
    );
  }

  async deleteChat(chatId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return null;
    }

    return await ChatModel.findOneAndDelete({ chatId, sessionName });
  }

  async getChatCount(sessionName: string): Promise<number> {
    if (!config.messageStorage?.enabled || !ChatModel) {
      return 0;
    }

    return await ChatModel.countDocuments({ sessionName, isArchived: false });
  }
}

export default new ChatStorageService();
