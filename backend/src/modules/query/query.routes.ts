import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getSingleContact,
  updateContactStatus,
  markContactAsRead,
  addContactNote,
  deleteContact
} from "./query.controller.js";

import {
  createContactValidator,
  mongoIdValidator,
  updateContactStatusValidator,
  addContactNoteValidator,
  getAllContactsValidator
} from "./query.validation.js";

import { validate } from "../../middleware/validate.js";
import { accessTokenAuthMiddleware } from "../../middleware/authMiddleware.js";

const router = Router();

/* =========================
   Public Routes
========================= */

router.post(
  "/",
  createContactValidator,
  validate,
  createContact
);

/* =========================
   Admin Routes
========================= */

router.get(
  "/",
  accessTokenAuthMiddleware,
  getAllContactsValidator,
  validate,
  getAllContacts
);

router.get(
  "/:id",
  accessTokenAuthMiddleware,
  mongoIdValidator,
  validate,
  getSingleContact
);

router.patch(
  "/status/:id",
  accessTokenAuthMiddleware,
  mongoIdValidator,
  updateContactStatusValidator,
  validate,
  updateContactStatus
);

router.patch(
  "/read/:id",
  accessTokenAuthMiddleware,
  mongoIdValidator,
  validate,
  markContactAsRead
);

router.patch(
  "/:id/note",
  accessTokenAuthMiddleware,
  mongoIdValidator,
  addContactNoteValidator,
  validate,
  addContactNote
);

router.delete(
  "/:id",
  accessTokenAuthMiddleware,
  mongoIdValidator,
  validate,
  deleteContact
);

export default router;