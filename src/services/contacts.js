import { ContactsCollection } from '../models/contact.js';

export const getAllContacts = () => ContactsCollection.find();

export const getContactById = (contactId) => ContactsCollection.findById(contactId);

export const createContact = (payload) => ContactsCollection.create(payload);

export const updateContact = (contactId, payload) => {
  return ContactsCollection.findByIdAndUpdate(contactId, payload, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = (contactId) => {
  return ContactsCollection.findByIdAndDelete(contactId);
};
