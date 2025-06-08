import api from "./axios";

export const getTranscription = async (audio: File) => {
    try {
        const formData = new FormData();
        formData.append("audio", audio);
        const response = await api.post("/meetings/testTranscription", formData);
        return response.data;
    } catch (error) {
        console.error('Error in getTranscription:', error);
        throw error;
    }
};