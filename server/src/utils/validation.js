import mongoose from "mongoose";

export const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
export const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value) => (typeof value === "string" ? value.trim().toLowerCase() : "");

export const isValidEmail = (value) => emailRegex.test(normalizeEmail(value));

export const badRequest = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const notFound = (message) => {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
};

export const forbidden = (message) => {
  const error = new Error(message);
  error.statusCode = 403;
  return error;
};

export const unauthorized = (message) => {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
};

export const conflict = (message) => {
  const error = new Error(message);
  error.statusCode = 409;
  return error;
};
