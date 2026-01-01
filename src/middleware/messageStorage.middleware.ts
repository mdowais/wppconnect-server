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
import config from '../config';
import ChatStorageService from '../services/storage/ChatStorageService';
import ContactStorageService from '../services/storage/ContactStorageService';
import MediaStorageService from '../services/storage/MediaStorageService';
import MessageStorageService from '../services/storage/MessageStorageService';

class MessageStorageMiddleware {
  /**
   * Store a message in the database
   */
  async storeMessage(message: any, sessionName: string): Promise<void> {
    if (!config.messageStorage?.enabled) {
      return;
    }

    try {
      const messageType = this.getMessageType(message);
      
      const messageData = {
        messageId: message.id || message.messageId,
        sessionName,
        chatId: message.chatId || message.from,
        senderId: message.from || message.author || message.sender?.id,
        recipientId: message.to,
        content: message.body || message.content || '',
        messageType,
        timestamp: message.timestamp
          ? new Date(message.timestamp * 1000)
          : new Date(),
        fromMe: message.fromMe || false,
        isForwarded: message.isForwarded || false,
        isGroup: message.isGroupMsg || false,
        quotedMsgId: message.quotedMsgId,
        metadata: {
          type: message.type,
          mimetype: message.mimetype,
          caption: message.caption,
          lat: message.lat,
          lng: message.lng,
        },
        ack: message.ack || 0,
      };

      // Handle media data
      if (this.hasMediaData(message)) {
        messageData.metadata = {
          ...messageData.metadata,
          filename: message.filename,
          size: message.size,
        };

        // Store media metadata separately
        if (message.id) {
          await this.storeMediaMetadata(message, sessionName);
        }
      }

      await MessageStorageService.saveMessage(messageData);

      // Update chat last message
      await this.updateChatLastMessage(messageData);
    } catch (error) {
      console.error('Error storing message:', error);
    }
  }

  /**
   * Store media metadata
   */
  async storeMediaMetadata(message: any, sessionName: string): Promise<void> {
    if (!config.messageStorage?.enabled) {
      return;
    }

    try {
      const mediaData = {
        mediaId: message.id + '_media',
        sessionName,
        messageId: message.id || message.messageId,
        filename: message.filename,
        mimeType: message.mimetype,
        size: message.size,
        url: message.deprecatedMms3Url || message.clientUrl,
        caption: message.caption,
        thumbnail: message.thumbnail,
        duration: message.duration,
        width: message.width,
        height: message.height,
        pageCount: message.pageCount,
        isDownloaded: false,
      };

      await MediaStorageService.saveMedia(mediaData);
    } catch (error) {
      console.error('Error storing media metadata:', error);
    }
  }

  /**
   * Update chat with last message
   */
  async updateChatLastMessage(messageData: any): Promise<void> {
    if (!config.messageStorage?.enabled) {
      return;
    }

    try {
      const chatData = {
        chatId: messageData.chatId,
        sessionName: messageData.sessionName,
        isGroup: messageData.isGroup,
        lastMessage: {
          messageId: messageData.messageId,
          content: messageData.content,
          timestamp: messageData.timestamp,
          senderId: messageData.senderId,
        },
      };

      await ChatStorageService.saveOrUpdateChat(chatData);
    } catch (error) {
      console.error('Error updating chat last message:', error);
    }
  }

  /**
   * Store or update contact information
   */
  async storeContact(contact: any, sessionName: string): Promise<void> {
    if (!config.messageStorage?.enabled) {
      return;
    }

    try {
      const contactData = {
        contactId: contact.id || contact.contactId,
        sessionName,
        name: contact.name || contact.formattedName,
        pushname: contact.pushname,
        number: contact.number || contact.id,
        isBlocked: contact.isBlocked || false,
        isMyContact: contact.isMyContact || false,
        isWAContact: contact.isWAContact !== false,
        isGroup: contact.isGroup || false,
        profilePicUrl: contact.profilePicUrl,
        status: contact.status,
        labels: contact.labels || [],
      };

      await ContactStorageService.saveOrUpdateContact(contactData);
    } catch (error) {
      console.error('Error storing contact:', error);
    }
  }

  /**
   * Update message acknowledgment status
   */
  async updateMessageAck(ackData: any, sessionName: string): Promise<void> {
    if (!config.messageStorage?.enabled) {
      return;
    }

    try {
      const messageId = ackData.id?.id || ackData.id;
      const ack = ackData.ack;

      if (messageId && ack !== undefined) {
        await MessageStorageService.updateMessageAck(messageId, sessionName, ack);
      }
    } catch (error) {
      console.error('Error updating message ack:', error);
    }
  }

  /**
   * Get message type from message object
   */
  private getMessageType(message: any): string {
    const typeMap: { [key: string]: string } = {
      chat: 'text',
      image: 'image',
      video: 'video',
      audio: 'audio',
      ptt: 'audio',
      document: 'document',
      sticker: 'sticker',
      location: 'location',
      vcard: 'contact',
      multi_vcard: 'contact',
      poll: 'poll',
      reaction: 'reaction',
      revoked: 'revoked',
    };

    return typeMap[message.type] || 'unknown';
  }

  /**
   * Check if message has media data
   */
  private hasMediaData(message: any): boolean {
    const mediaTypes = ['image', 'video', 'audio', 'ptt', 'document', 'sticker'];
    return mediaTypes.includes(message.type);
  }
}

export default new MessageStorageMiddleware();
