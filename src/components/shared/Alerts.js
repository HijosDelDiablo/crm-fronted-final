import { toast } from 'react-hot-toast';

export const notifySuccess = (message, opts = {}) =>
  toast.success(message, { position: 'top-center', ...opts });

export const notifyError = (message, opts = {}) =>
  toast.error(message, { position: 'top-center', ...opts });

export const notifyInfo = (message, opts = {}) =>
  toast(message, { position: 'top-center', ...opts });
