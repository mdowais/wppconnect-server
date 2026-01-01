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
import ContactModel from '../../models/Contact';

class ContactStorageService {
  async saveOrUpdateContact(contactData: any): Promise<any> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return null;
    }

    try {
      return await ContactModel.findOneAndUpdate(
        { contactId: contactData.contactId, sessionName: contactData.sessionName },
        contactData,
        { new: true, upsert: true }
      );
    } catch (error) {
      throw error;
    }
  }

  async getContactById(contactId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return null;
    }

    return await ContactModel.findOne({ contactId, sessionName });
  }

  async getAllContacts(
    sessionName: string,
    options: { limit?: number; skip?: number; isBlocked?: boolean } = {}
  ): Promise<any[]> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return [];
    }

    const filter: any = { sessionName };
    if (options.isBlocked !== undefined) {
      filter.isBlocked = options.isBlocked;
    }

    const query = ContactModel.find(filter);

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    query.sort({ name: 1 });

    return await query.exec();
  }

  async searchContacts(
    sessionName: string,
    searchText: string,
    options: { limit?: number; skip?: number } = {}
  ): Promise<any[]> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return [];
    }

    const query = ContactModel.find({
      sessionName,
      $or: [
        { name: { $regex: searchText, $options: 'i' } },
        { pushname: { $regex: searchText, $options: 'i' } },
        { number: { $regex: searchText, $options: 'i' } },
      ],
    });

    if (options.skip) query.skip(options.skip);
    if (options.limit) query.limit(options.limit);
    query.sort({ name: 1 });

    return await query.exec();
  }

  async blockContact(
    contactId: string,
    sessionName: string,
    isBlocked: boolean
  ): Promise<any> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return null;
    }

    return await ContactModel.findOneAndUpdate(
      { contactId, sessionName },
      { isBlocked },
      { new: true }
    );
  }

  async deleteContact(contactId: string, sessionName: string): Promise<any> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return null;
    }

    return await ContactModel.findOneAndDelete({ contactId, sessionName });
  }

  async getContactCount(sessionName: string): Promise<number> {
    if (!config.messageStorage?.enabled || !ContactModel) {
      return 0;
    }

    return await ContactModel.countDocuments({ sessionName });
  }
}

export default new ContactStorageService();
