# Message and Chat History Storage

This document describes the message and chat history storage feature in WPPConnect Server.

## Overview

The message storage feature provides comprehensive persistence for WhatsApp messages, chats, contacts, and media metadata using MongoDB. This is an **optional** feature that can be enabled via configuration.

## Features

- ✅ **Automatic Message Storage**: All incoming and outgoing messages are automatically stored
- ✅ **Chat History**: Store and retrieve complete chat histories
- ✅ **Contact Management**: Persist contact information
- ✅ **Media Metadata**: Track media files with metadata
- ✅ **Search Functionality**: Search through messages and contacts
- ✅ **Statistics**: Get chat statistics and message counts
- ✅ **ACK Updates**: Track message acknowledgment status
- ✅ **Backward Compatible**: Does not affect existing functionality

## Configuration

### Enable Message Storage

Add the following configuration to your `config.ts` or environment variables:

```typescript
messageStorage: {
  enabled: true,  // Set to true to enable message storage
  mongodbDatabase: 'wppconnect_messages',
  mongodbUser: '',
  mongodbPassword: '',
  mongodbHost: 'localhost',
  mongoIsRemote: false,
  mongoURLRemote: '',
  mongodbPort: 27017,
}
```

### Environment Variables

You can also configure via environment variables:

```bash
MESSAGE_STORAGE_ENABLED=true
MESSAGE_STORAGE_MONGODB_DATABASE=wppconnect_messages
MESSAGE_STORAGE_MONGODB_HOST=localhost
MESSAGE_STORAGE_MONGODB_PORT=27017
MESSAGE_STORAGE_MONGODB_USER=
MESSAGE_STORAGE_MONGODB_PASSWORD=
MESSAGE_STORAGE_MONGO_IS_REMOTE=false
MESSAGE_STORAGE_MONGO_URL_REMOTE=
```

## Database Schema

### Collections

#### Messages Collection
Stores individual WhatsApp messages with the following fields:
- `messageId`: Unique message identifier
- `sessionName`: Session that received/sent the message
- `chatId`: Chat/conversation identifier
- `senderId`: Message sender ID
- `content`: Message text content
- `messageType`: Type (text, image, video, audio, document, sticker, etc.)
- `timestamp`: Message timestamp
- `fromMe`: Boolean indicating if message is from user
- `isForwarded`: Boolean indicating if message is forwarded
- `isGroup`: Boolean indicating if chat is a group
- `mediaData`: Media file metadata
- `ack`: Message acknowledgment status (0-4)
- `isDeleted`: Boolean for soft deletion
- `isStarred`: Boolean for starred messages

#### Chats Collection
Stores chat/conversation information:
- `chatId`: Unique chat identifier
- `sessionName`: Session name
- `isGroup`: Boolean indicating group chat
- `name`: Chat name
- `participants`: Array of participant IDs
- `lastMessage`: Last message metadata
- `unreadCount`: Number of unread messages
- `isArchived`: Archive status
- `isMuted`: Mute status
- `isPinned`: Pin status

#### Contacts Collection
Stores contact information:
- `contactId`: Unique contact identifier
- `sessionName`: Session name
- `name`: Contact name
- `pushname`: WhatsApp push name
- `number`: Phone number
- `isBlocked`: Block status
- `isMyContact`: Boolean if in contacts
- `profilePicUrl`: Profile picture URL
- `status`: WhatsApp status
- `labels`: Array of labels

#### Media Collection
Stores media file metadata:
- `mediaId`: Unique media identifier
- `sessionName`: Session name
- `messageId`: Associated message ID
- `filename`: File name
- `mimeType`: MIME type
- `size`: File size in bytes
- `url`: Media URL
- `thumbnail`: Thumbnail data
- `caption`: Media caption

## API Endpoints

All endpoints require authentication with bearer token.

### Chat History

#### Get All Chats
```http
GET /api/:session/history/chats
```

Query Parameters:
- `limit` (number): Limit results (default: 50)
- `skip` (number): Skip results (default: 0)
- `archived` (boolean): Filter archived chats

Response:
```json
{
  "status": "success",
  "response": [
    {
      "chatId": "5521999999999@c.us",
      "sessionName": "my_session",
      "isGroup": false,
      "name": "John Doe",
      "lastMessage": {
        "messageId": "...",
        "content": "Hello",
        "timestamp": "2024-01-01T00:00:00.000Z",
        "senderId": "5521999999999@c.us"
      },
      "unreadCount": 0
    }
  ],
  "count": 1
}
```

#### Get Chat By ID
```http
GET /api/:session/history/chats/:chatId
```

#### Get Chat Messages
```http
GET /api/:session/history/chats/:chatId/messages
```

Query Parameters:
- `limit` (number): Limit results (default: 50)
- `skip` (number): Skip results (default: 0)

Response:
```json
{
  "status": "success",
  "response": {
    "messages": [...],
    "total": 150,
    "limit": 50,
    "skip": 0
  }
}
```

#### Get Chat Statistics
```http
GET /api/:session/history/chats/:chatId/stats
```

Response:
```json
{
  "status": "success",
  "response": {
    "chatId": "5521999999999@c.us",
    "messageCount": 150,
    "unreadCount": 5
  }
}
```

#### Search Messages
```http
GET /api/:session/history/messages/search?query=hello
```

Query Parameters:
- `query` (string, required): Search text
- `limit` (number): Limit results (default: 50)
- `skip` (number): Skip results (default: 0)

### Contact History

#### Get All Contacts
```http
GET /api/:session/history/contacts
```

Query Parameters:
- `limit` (number): Limit results (default: 100)
- `skip` (number): Skip results (default: 0)
- `blocked` (boolean): Filter blocked contacts

#### Get Contact By ID
```http
GET /api/:session/history/contacts/:contactId
```

#### Search Contacts
```http
GET /api/:session/history/contacts/search?query=john
```

Query Parameters:
- `query` (string, required): Search text
- `limit` (number): Limit results (default: 50)
- `skip` (number): Skip results (default: 0)

### Media History

#### Get All Media
```http
GET /api/:session/history/media
```

Query Parameters:
- `limit` (number): Limit results (default: 50)
- `skip` (number): Skip results (default: 0)
- `mimeType` (string): Filter by MIME type (e.g., "image", "video")

#### Get Media By Message ID
```http
GET /api/:session/history/media/:messageId
```

## Usage Examples

### Enable Storage in Configuration

```typescript
// config.ts
export default {
  // ... other config
  messageStorage: {
    enabled: true,
    mongodbDatabase: 'wppconnect_messages',
    mongodbHost: 'localhost',
    mongodbPort: 27017,
    mongoIsRemote: false,
  },
  // ... other config
}
```

### Retrieve Chat History

```javascript
const axios = require('axios');

// Get all chats
const response = await axios.get(
  'http://localhost:21465/api/my_session/history/chats',
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    params: {
      limit: 20,
      skip: 0
    }
  }
);

console.log(response.data.response);
```

### Search Messages

```javascript
// Search for messages containing "hello"
const response = await axios.get(
  'http://localhost:21465/api/my_session/history/messages/search',
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    params: {
      query: 'hello',
      limit: 50
    }
  }
);

console.log(response.data.response);
```

### Get Chat Statistics

```javascript
const chatId = '5521999999999@c.us';
const response = await axios.get(
  `http://localhost:21465/api/my_session/history/chats/${chatId}/stats`,
  {
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    }
  }
);

console.log('Message Count:', response.data.response.messageCount);
console.log('Unread Count:', response.data.response.unreadCount);
```

## Performance Considerations

### Database Indexes

The following indexes are automatically created for optimal performance:

**Messages Collection:**
- `messageId` (unique)
- `sessionName`
- `chatId`
- `messageType`
- `timestamp`
- `fromMe`

**Chats Collection:**
- `chatId`, `sessionName` (compound unique)
- `sessionName`
- `isGroup`
- `isArchived`

**Contacts Collection:**
- `contactId`, `sessionName` (compound unique)
- `sessionName`
- `isBlocked`

**Media Collection:**
- `mediaId` (unique)
- `sessionName`
- `messageId`

### Query Optimization

- Use pagination (`limit` and `skip`) for large result sets
- Filter by `sessionName` to isolate data by session
- Use specific queries instead of retrieving all data
- Consider implementing data retention policies for old messages

## Data Retention

Currently, all data is stored indefinitely. Consider implementing a data retention policy:

```javascript
// Example: Delete messages older than 90 days
const MessageModel = require('./models/Message');

async function cleanupOldMessages() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  
  await MessageModel.deleteMany({
    timestamp: { $lt: cutoffDate }
  });
}
```

## Backward Compatibility

This feature is **completely optional** and does not affect existing functionality:
- When `messageStorage.enabled` is `false`, no storage operations occur
- All existing API endpoints work without changes
- No breaking changes to existing code
- Token storage (MongoDB/Redis/File) continues to work independently

## Troubleshooting

### Storage Not Working

1. **Check if enabled**: Verify `messageStorage.enabled` is `true` in config
2. **Check MongoDB connection**: Ensure MongoDB is running and accessible
3. **Check logs**: Look for connection errors in server logs
4. **Verify mongoose**: Ensure mongoose is installed as a peer dependency

### Performance Issues

1. **Use pagination**: Always use `limit` and `skip` parameters
2. **Check indexes**: Verify indexes are created in MongoDB
3. **Monitor query performance**: Use MongoDB profiling tools
4. **Consider sharding**: For very large datasets, consider MongoDB sharding

### Connection Errors

```
Message storage MongoDB connection error: ...
```

Solutions:
- Verify MongoDB is running: `mongod --version`
- Check connection string in config
- Ensure network connectivity
- Check firewall rules

## Future Enhancements

Potential improvements for future versions:
- [ ] Data export functionality
- [ ] Advanced search with filters
- [ ] Message analytics and insights
- [ ] Automatic data archival
- [ ] Multi-language message search
- [ ] Message categories and tags
- [ ] Scheduled cleanup jobs
- [ ] Backup and restore utilities
