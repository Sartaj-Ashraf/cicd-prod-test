import Contact from "../../models/query.model.js";
import {
  getPaginationParams,
  getPaginationInfo
} from "../../utils/pagination.js";
import type { ParsedQs } from "qs";

/* =========================
   Create Contact
========================= */
export const createContactService = async (
  payload: Partial<any>
) => {
  const data = await Contact.create(payload);

  return {
    success: true,
    statusCode: 201,
    message: "Query submitted successfully",
    data
  };
};

/* =========================
   Get All Contacts
========================= */
export const getAllContactsService = async (
  query: ParsedQs
) => {
  const { page, limit, skip } = getPaginationParams(query);

  const filter: any = {};

  // Optional filters
  if (query.status) {
    filter.status = query.status;
  }

  if (query.isRead) {
    filter.isRead = query.isRead === "true";
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
      { phoneNumber: { $regex: query.search, $options: "i" } },
      { subject: { $regex: query.search, $options: "i" } }
    ];
  }

  const [data, totalDocs] = await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Contact.countDocuments(filter)
  ]);

  const pagination = getPaginationInfo(
    totalDocs,
    page,
    limit
  );

  return {
    success: true,
    statusCode: 200,
    data,
    pagination
  };
};

/* =========================
   Get Single Contact
========================= */
export const getSingleContactService = async (
  id: string
) => {
  const data = await Contact.findById(id).lean();

  if (!data) {
    return {
      success: false,
      statusCode: 404,
      message: "Contact query not found"
    };
  }

  return {
    success: true,
    statusCode: 200,
    data
  };
};

/* =========================
   Update Status
========================= */
export const updateContactStatusService = async (
  id: string,
  status: string
) => {
  const data = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!data) {
    return {
      success: false,
      statusCode: 404,
      message: "Contact query not found"
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: "Status updated successfully",
    data
  };
};

/* =========================
   Mark As Read
========================= */
export const markContactAsReadService = async (
  id: string
) => {
  const data = await Contact.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  if (!data) {
    return {
      success: false,
      statusCode: 404,
      message: "Contact query not found"
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: "Marked as read",
    data
  };
};

/* =========================
   Add Note
========================= */
export const addContactNoteService = async (
  id: string,
  note: string
) => {
  const data = await Contact.findByIdAndUpdate(
    id,
    { note },
    { new: true }
  );

  if (!data) {
    return {
      success: false,
      statusCode: 404,
      message: "Contact query not found"
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: "Note updated successfully",
    data
  };
};

/* =========================
   Delete Contact
========================= */
export const deleteContactService = async (
  id: string
) => {
  const data = await Contact.findByIdAndDelete(id);

  if (!data) {
    return {
      success: false,
      statusCode: 404,
      message: "Contact query not found"
    };
  }

  return {
    success: true,
    statusCode: 200,
    message: "Deleted successfully"
  };
};