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

const ContactModel = config.messageStorage?.enabled && messageMongoose
  ? messageMongoose.model(
      'Contact',
      new messageMongoose.Schema(
        {
          contactId: { type: String, required: true, index: true },
          sessionName: { type: String, required: true, index: true },
          name: { type: String },
          pushname: { type: String },
          number: { type: String, required: true },
          isBlocked: { type: Boolean, default: false, index: true },
          isMyContact: { type: Boolean, default: false },
          isWAContact: { type: Boolean, default: true },
          isGroup: { type: Boolean, default: false },
          profilePicUrl: { type: String },
          status: { type: String },
          labels: [{ type: String }],
          metadata: { type: Object },
        },
        { 
          timestamps: true,
          collection: 'contacts'
        }
      )
    )
  : null;

// Create compound index for sessionName and contactId
if (ContactModel) {
  ContactModel.schema.index({ sessionName: 1, contactId: 1 }, { unique: true });
}

export default ContactModel;
