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

const MediaModel = config.messageStorage?.enabled && messageMongoose
  ? messageMongoose.model(
      'Media',
      new messageMongoose.Schema(
        {
          mediaId: { type: String, required: true, unique: true, index: true },
          sessionName: { type: String, required: true, index: true },
          messageId: { type: String, required: true, index: true },
          filename: { type: String },
          mimeType: { type: String },
          size: { type: Number },
          filePath: { type: String },
          url: { type: String },
          thumbnail: { type: String },
          caption: { type: String },
          duration: { type: Number }, // For audio/video
          width: { type: Number }, // For images/video
          height: { type: Number }, // For images/video
          pageCount: { type: Number }, // For documents
          isDownloaded: { type: Boolean, default: false },
          metadata: { type: Object },
        },
        { 
          timestamps: true,
          collection: 'media'
        }
      )
    )
  : null;

export default MediaModel;
