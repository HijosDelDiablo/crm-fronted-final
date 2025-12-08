import { fetchApiPost } from "../utils/api-fetch-factory.util";

export const sendEmail = async (emailData, navigate) => {
    // emailData: { to, subject, htmlBody, attachments }
    return await fetchApiPost('/email-module/send', emailData, navigate, 'Error al enviar email');
};