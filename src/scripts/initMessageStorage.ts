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

/**
 * Database initialization script for message storage
 * 
 * This script ensures all MongoDB indexes are created for optimal performance.
 * Run this script once after enabling message storage for the first time.
 * 
 * Usage: npm run init-message-storage
 * Or: node dist/scripts/initMessageStorage.js
 */

import config from '../config';

async function initializeMessageStorage() {
  if (!config.messageStorage?.enabled) {
    console.log('❌ Message storage is not enabled in configuration.');
    console.log('   Set messageStorage.enabled to true in config.ts to enable.');
    process.exit(1);
  }

  console.log('🚀 Initializing message storage database...');
  console.log(`   Database: ${config.messageStorage.mongodbDatabase}`);
  console.log(`   Host: ${config.messageStorage.mongodbHost}:${config.messageStorage.mongodbPort}`);

  try {
    // Import mongoose connection
    const messageMongoose = require('../util/db/mongodb/messageDb').default;

    if (!messageMongoose) {
      throw new Error('Failed to connect to MongoDB');
    }

    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 10000);

      if (messageMongoose.readyState === 1) {
        clearTimeout(timeout);
        resolve(true);
      } else {
        messageMongoose.once('connected', () => {
          clearTimeout(timeout);
          resolve(true);
        });
        messageMongoose.once('error', (err: any) => {
          clearTimeout(timeout);
          reject(err);
        });
      }
    });

    console.log('✅ Connected to MongoDB successfully');

    // Import models to trigger index creation
    console.log('📋 Creating indexes...');
    
    const MessageModel = require('../models/Message').default;
    const ChatModel = require('../models/Chat').default;
    const ContactModel = require('../models/Contact').default;
    const MediaModel = require('../models/Media').default;

    if (MessageModel) {
      await MessageModel.createIndexes();
      console.log('   ✓ Message indexes created');
    }

    if (ChatModel) {
      await ChatModel.createIndexes();
      console.log('   ✓ Chat indexes created');
    }

    if (ContactModel) {
      await ContactModel.createIndexes();
      console.log('   ✓ Contact indexes created');
    }

    if (MediaModel) {
      await MediaModel.createIndexes();
      console.log('   ✓ Media indexes created');
    }

    console.log('');
    console.log('🎉 Message storage database initialized successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Start your WPPConnect server');
    console.log('  2. Messages will be automatically stored');
    console.log('  3. Use the history API endpoints to retrieve data');
    console.log('');
    console.log('See docs/MESSAGE_STORAGE.md for API documentation.');

    // Close connection
    await messageMongoose.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing message storage:', error);
    console.error('');
    console.error('Troubleshooting:');
    console.error('  1. Ensure MongoDB is running');
    console.error('  2. Check connection settings in config.ts');
    console.error('  3. Verify network connectivity');
    console.error('  4. Check MongoDB logs for errors');
    process.exit(1);
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeMessageStorage().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export default initializeMessageStorage;
