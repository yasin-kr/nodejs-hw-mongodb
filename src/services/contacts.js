import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const contactFilter = { userId };

  if (filter.contactType) {
    contactFilter.contactType = filter.contactType;
  }

  if (filter.isFavourite !== undefined) {
    contactFilter.isFavourite = filter.isFavourite;
  }

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactFilter),
    ContactsCollection.find(contactFilter)
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = (contactId, userId) => {
  return ContactsCollection.findOne({
    _id: contactId,
    userId,
  });
};

export const createContact = (payload) => ContactsCollection.create(payload);

export const updateContact = (contactId, userId, payload) => {
  return ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );
};

export const deleteContact = (contactId, userId) => {
  return ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
