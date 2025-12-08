import { fetchApiPost } from "../utils/api-fetch-factory.util";

export const queryAI = async (queryData, navigate) => {
    return await fetchApiPost('/iamodel/query', queryData, navigate, 'Error al consultar asistente IA');
};
