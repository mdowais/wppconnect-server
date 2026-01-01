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
import messageMongoose from '../util/db/mongodb/messageDb';

const MessageModel = config.messageStorage?.enabled && messageMongoose
  ? messageMongoose.model(
      'Message',
      new messageMongoose.Schema(
        {
          messageId: { type: String, required: true, unique: true, index: true },
          sessionName: { type: String, required: true, index: true },
          chatId: { type: String, required: true, index: true },
          senderId: { type: String, required: true },
          recipientId: { type: String },
          content: { type: String },
          messageType: { 
            type: String, 
            enum: ['text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'contact', 'poll', 'reaction', 'revoked', 'unknown'],
            default: 'text',
            index: true
          },
          timestamp: { type: Date, required: true, index: true },
          fromMe: { type: Boolean, default: false, index: true },
          isForwarded: { type: Boolean, default: false },
          isGroup: { type: Boolean, default: false },
          quotedMsgId: { type: String },
          mediaData: {
            filename: String,
            mimeType: String,
            size: Number,
            url: String,
            caption: String,
          },
          metadata: { type: Object },
          ack: { type: Number, default: 0 }, // 0: pending, 1: server, 2: device, 3: read, 4: played
          isDeleted: { type: Boolean, default: false },
          isStarred: { type: Boolean, default: false },
        },
        { 
          timestamps: true,
          collection: 'messages'
        }
      )
    )
  : null;

export default MessageModel;
