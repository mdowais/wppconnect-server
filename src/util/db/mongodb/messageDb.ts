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
import config from '../../../config';

let messageMongoose: any = null;

if (config.messageStorage?.enabled) {
  const mongoose = require('mongoose');
  messageMongoose = mongoose.createConnection();
  
  const userAndPassword =
    config.messageStorage.mongodbUser && config.messageStorage.mongodbPassword
      ? `${config.messageStorage.mongodbUser}:${config.messageStorage.mongodbPassword}@`
      : '';

  const connectionString = config.messageStorage.mongoIsRemote
    ? config.messageStorage.mongoURLRemote
    : `mongodb://${userAndPassword}${config.messageStorage.mongodbHost}:${config.messageStorage.mongodbPort}/${config.messageStorage.mongodbDatabase}`;

  messageMongoose
    .openUri(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Message storage MongoDB connected successfully');
    })
    .catch((err: any) => {
      console.error('Message storage MongoDB connection error:', err);
    });
}

export default messageMongoose;
