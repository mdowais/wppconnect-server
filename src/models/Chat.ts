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

const ChatModel = config.messageStorage?.enabled && messageMongoose
  ? messageMongoose.model(
      'Chat',
      new messageMongoose.Schema(
        {
          chatId: { type: String, required: true, index: true },
          sessionName: { type: String, required: true, index: true },
          isGroup: { type: Boolean, default: false, index: true },
          name: { type: String },
          participants: [{ type: String }],
          lastMessage: {
            messageId: String,
            content: String,
            timestamp: Date,
            senderId: String,
          },
          unreadCount: { type: Number, default: 0 },
          isArchived: { type: Boolean, default: false, index: true },
          isMuted: { type: Boolean, default: false },
          isPinned: { type: Boolean, default: false },
          profilePicUrl: { type: String },
          metadata: { type: Object },
        },
        { 
          timestamps: true,
          collection: 'chats'
        }
      )
    )
  : null;

// Create compound index for sessionName and chatId
if (ChatModel) {
  ChatModel.schema.index({ sessionName: 1, chatId: 1 }, { unique: true });
}

export default ChatModel;
