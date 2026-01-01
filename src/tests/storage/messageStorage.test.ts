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

describe('Message Storage Services', () => {
  describe('Configuration', () => {
    it('should have messageStorage configuration defined', () => {
      const config = require('../../config').default;
      expect(config).toHaveProperty('messageStorage');
      expect(config.messageStorage).toHaveProperty('enabled');
      expect(typeof config.messageStorage.enabled).toBe('boolean');
    });

    it('should have all required messageStorage config fields', () => {
      const config = require('../../config').default;
      const messageStorage = config.messageStorage;
      
      expect(messageStorage).toHaveProperty('mongodbDatabase');
      expect(messageStorage).toHaveProperty('mongodbHost');
      expect(messageStorage).toHaveProperty('mongodbPort');
      expect(messageStorage).toHaveProperty('mongoIsRemote');
    });
  });

  describe('Storage Services Initialization', () => {
    it('should import MessageStorageService without errors', () => {
      expect(() => {
        require('../../services/storage/MessageStorageService');
      }).not.toThrow();
    });

    it('should import ChatStorageService without errors', () => {
      expect(() => {
        require('../../services/storage/ChatStorageService');
      }).not.toThrow();
    });

    it('should import ContactStorageService without errors', () => {
      expect(() => {
        require('../../services/storage/ContactStorageService');
      }).not.toThrow();
    });

    it('should import MediaStorageService without errors', () => {
      expect(() => {
        require('../../services/storage/MediaStorageService');
      }).not.toThrow();
    });
  });

  describe('Models', () => {
    it('should import Message model without errors', () => {
      expect(() => {
        require('../../models/Message');
      }).not.toThrow();
    });

    it('should import Chat model without errors', () => {
      expect(() => {
        require('../../models/Chat');
      }).not.toThrow();
    });

    it('should import Contact model without errors', () => {
      expect(() => {
        require('../../models/Contact');
      }).not.toThrow();
    });

    it('should import Media model without errors', () => {
      expect(() => {
        require('../../models/Media');
      }).not.toThrow();
    });
  });

  describe('Middleware', () => {
    it('should import messageStorage middleware without errors', () => {
      expect(() => {
        require('../../middleware/messageStorage.middleware');
      }).not.toThrow();
    });

    it('should have storeMessage method', () => {
      const middleware = require('../../middleware/messageStorage.middleware').default;
      expect(middleware).toHaveProperty('storeMessage');
      expect(typeof middleware.storeMessage).toBe('function');
    });

    it('should have storeContact method', () => {
      const middleware = require('../../middleware/messageStorage.middleware').default;
      expect(middleware).toHaveProperty('storeContact');
      expect(typeof middleware.storeContact).toBe('function');
    });

    it('should have updateMessageAck method', () => {
      const middleware = require('../../middleware/messageStorage.middleware').default;
      expect(middleware).toHaveProperty('updateMessageAck');
      expect(typeof middleware.updateMessageAck).toBe('function');
    });
  });

  describe('Storage Service Methods', () => {
    let MessageStorageService: any;
    let ChatStorageService: any;
    let ContactStorageService: any;
    let MediaStorageService: any;

    beforeAll(() => {
      MessageStorageService = require('../../services/storage/MessageStorageService').default;
      ChatStorageService = require('../../services/storage/ChatStorageService').default;
      ContactStorageService = require('../../services/storage/ContactStorageService').default;
      MediaStorageService = require('../../services/storage/MediaStorageService').default;
    });

    describe('MessageStorageService', () => {
      it('should have saveMessage method', () => {
        expect(MessageStorageService).toHaveProperty('saveMessage');
        expect(typeof MessageStorageService.saveMessage).toBe('function');
      });

      it('should have getMessageById method', () => {
        expect(MessageStorageService).toHaveProperty('getMessageById');
        expect(typeof MessageStorageService.getMessageById).toBe('function');
      });

      it('should have getMessagesByChatId method', () => {
        expect(MessageStorageService).toHaveProperty('getMessagesByChatId');
        expect(typeof MessageStorageService.getMessagesByChatId).toBe('function');
      });

      it('should have searchMessages method', () => {
        expect(MessageStorageService).toHaveProperty('searchMessages');
        expect(typeof MessageStorageService.searchMessages).toBe('function');
      });

      it('should have updateMessageAck method', () => {
        expect(MessageStorageService).toHaveProperty('updateMessageAck');
        expect(typeof MessageStorageService.updateMessageAck).toBe('function');
      });

      it('should have deleteMessage method', () => {
        expect(MessageStorageService).toHaveProperty('deleteMessage');
        expect(typeof MessageStorageService.deleteMessage).toBe('function');
      });

      it('should have getMessageCount method', () => {
        expect(MessageStorageService).toHaveProperty('getMessageCount');
        expect(typeof MessageStorageService.getMessageCount).toBe('function');
      });

      it('should have getUnreadCount method', () => {
        expect(MessageStorageService).toHaveProperty('getUnreadCount');
        expect(typeof MessageStorageService.getUnreadCount).toBe('function');
      });
    });

    describe('ChatStorageService', () => {
      it('should have saveOrUpdateChat method', () => {
        expect(ChatStorageService).toHaveProperty('saveOrUpdateChat');
        expect(typeof ChatStorageService.saveOrUpdateChat).toBe('function');
      });

      it('should have getChatById method', () => {
        expect(ChatStorageService).toHaveProperty('getChatById');
        expect(typeof ChatStorageService.getChatById).toBe('function');
      });

      it('should have getAllChats method', () => {
        expect(ChatStorageService).toHaveProperty('getAllChats');
        expect(typeof ChatStorageService.getAllChats).toBe('function');
      });

      it('should have updateLastMessage method', () => {
        expect(ChatStorageService).toHaveProperty('updateLastMessage');
        expect(typeof ChatStorageService.updateLastMessage).toBe('function');
      });

      it('should have archiveChat method', () => {
        expect(ChatStorageService).toHaveProperty('archiveChat');
        expect(typeof ChatStorageService.archiveChat).toBe('function');
      });

      it('should have deleteChat method', () => {
        expect(ChatStorageService).toHaveProperty('deleteChat');
        expect(typeof ChatStorageService.deleteChat).toBe('function');
      });
    });

    describe('ContactStorageService', () => {
      it('should have saveOrUpdateContact method', () => {
        expect(ContactStorageService).toHaveProperty('saveOrUpdateContact');
        expect(typeof ContactStorageService.saveOrUpdateContact).toBe('function');
      });

      it('should have getContactById method', () => {
        expect(ContactStorageService).toHaveProperty('getContactById');
        expect(typeof ContactStorageService.getContactById).toBe('function');
      });

      it('should have getAllContacts method', () => {
        expect(ContactStorageService).toHaveProperty('getAllContacts');
        expect(typeof ContactStorageService.getAllContacts).toBe('function');
      });

      it('should have searchContacts method', () => {
        expect(ContactStorageService).toHaveProperty('searchContacts');
        expect(typeof ContactStorageService.searchContacts).toBe('function');
      });

      it('should have blockContact method', () => {
        expect(ContactStorageService).toHaveProperty('blockContact');
        expect(typeof ContactStorageService.blockContact).toBe('function');
      });
    });

    describe('MediaStorageService', () => {
      it('should have saveMedia method', () => {
        expect(MediaStorageService).toHaveProperty('saveMedia');
        expect(typeof MediaStorageService.saveMedia).toBe('function');
      });

      it('should have getMediaById method', () => {
        expect(MediaStorageService).toHaveProperty('getMediaById');
        expect(typeof MediaStorageService.getMediaById).toBe('function');
      });

      it('should have getMediaByMessageId method', () => {
        expect(MediaStorageService).toHaveProperty('getMediaByMessageId');
        expect(typeof MediaStorageService.getMediaByMessageId).toBe('function');
      });

      it('should have getAllMedia method', () => {
        expect(MediaStorageService).toHaveProperty('getAllMedia');
        expect(typeof MediaStorageService.getAllMedia).toBe('function');
      });
    });
  });

  describe('Controllers', () => {
    it('should import chatHistoryController without errors', () => {
      expect(() => {
        require('../../controller/chatHistoryController');
      }).not.toThrow();
    });

    it('should import contactHistoryController without errors', () => {
      expect(() => {
        require('../../controller/contactHistoryController');
      }).not.toThrow();
    });

    it('should import mediaHistoryController without errors', () => {
      expect(() => {
        require('../../controller/mediaHistoryController');
      }).not.toThrow();
    });

    it('should have getAllStoredChats function', () => {
      const controller = require('../../controller/chatHistoryController');
      expect(controller).toHaveProperty('getAllStoredChats');
      expect(typeof controller.getAllStoredChats).toBe('function');
    });

    it('should have getChatMessages function', () => {
      const controller = require('../../controller/chatHistoryController');
      expect(controller).toHaveProperty('getChatMessages');
      expect(typeof controller.getChatMessages).toBe('function');
    });

    it('should have searchMessages function', () => {
      const controller = require('../../controller/chatHistoryController');
      expect(controller).toHaveProperty('searchMessages');
      expect(typeof controller.searchMessages).toBe('function');
    });
  });
});
