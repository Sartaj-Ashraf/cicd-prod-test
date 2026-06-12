import type { Request, Response } from "express";
import sendResponse from "../../utils/response.js";

import {
  createContactService,
  getAllContactsService,
  getSingleContactService,
  updateContactStatusService,
  markContactAsReadService,
  addContactNoteService,
  deleteContactService
} from "./query.service.js";

/* =========================
   Create Contact
========================= */
export const createContact = async (req: Request, res: Response) => {
  const result = await createContactService(req.body);
  return sendResponse(res, result);
};

/* =========================
   Get All Contacts
========================= */
export const getAllContacts = async (req: Request, res: Response) => {
  const result = await getAllContactsService(req.query);

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Contacts fetched successfully",
    data: result.data,
    pagination: result.pagination
  });
};

/* =========================
   Get Single Contact
========================= */
export const getSingleContact = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await getSingleContactService(id);
  return sendResponse(res, result);
};

/* =========================
   Update Status
========================= */
export const updateContactStatus = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;
  const result = await updateContactStatusService(
    id,
    req.body.status
  );

  return sendResponse(res, result);
};

/* =========================
   Mark As Read
========================= */
export const markContactAsRead = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;
  const result = await markContactAsReadService(id);
  return sendResponse(res, result);
};

/* =========================
   Add Note
========================= */
export const addContactNote = async (
  req: Request,
  res: Response
) => {
  const id = req.params.id as string;
  const result = await addContactNoteService(
    id,
    req.body.note
  );

  return sendResponse(res, result);
};

/* =========================
   Delete Contact
========================= */
export const deleteContact = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await deleteContactService(id);
  return sendResponse(res, result);
};