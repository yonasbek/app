import axios from '@/utils/api';
import { Training, CreateTrainingDto, UpdateTrainingDto } from '@/types/training';

class TrainingService {
  private readonly baseUrl = '/trainings';

  async getAll(): Promise<Training[]> {
    const response = await axios.get(this.baseUrl);
    return response.data;
  }

  async getById(id: string): Promise<Training> {
    const response = await axios.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async create(data: CreateTrainingDto, files?: {
    trip_report?: File[];
    photos?: File[];
    attendance?: File[];
    additional_letter?: File[];
  }): Promise<Training> {
    // First create the training
    const response = await axios.post(this.baseUrl, data);
    const training = response.data;

    // Then upload files if any
    if (files) {
      const uploadPromises: Promise<any>[] = [];

      if (files.trip_report && files.trip_report.length > 0) {
        const formData = new FormData();
        files.trip_report.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${training.id}/documents/trip_report`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.photos && files.photos.length > 0) {
        const formData = new FormData();
        files.photos.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${training.id}/documents/photos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.attendance && files.attendance.length > 0) {
        const formData = new FormData();
        files.attendance.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${training.id}/documents/attendance`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.additional_letter && files.additional_letter.length > 0) {
        const formData = new FormData();
        files.additional_letter.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${training.id}/documents/additional_letter`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      await Promise.all(uploadPromises);
      // Fetch updated training
      return await this.getById(training.id);
    }

    return training;
  }

  async update(id: string, data: UpdateTrainingDto, files?: {
    trip_report?: File[];
    photos?: File[];
    attendance?: File[];
    additional_letter?: File[];
  }): Promise<Training> {
    // Update training data
    const response = await axios.patch(`${this.baseUrl}/${id}`, data);
    const training = response.data;

    // Upload new files if any
    if (files) {
      const uploadPromises: Promise<any>[] = [];

      if (files.trip_report && files.trip_report.length > 0) {
        const formData = new FormData();
        files.trip_report.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${id}/documents/trip_report`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.photos && files.photos.length > 0) {
        const formData = new FormData();
        files.photos.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${id}/documents/photos`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.attendance && files.attendance.length > 0) {
        const formData = new FormData();
        files.attendance.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${id}/documents/attendance`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      if (files.additional_letter && files.additional_letter.length > 0) {
        const formData = new FormData();
        files.additional_letter.forEach(file => formData.append('files', file));
        uploadPromises.push(
          axios.post(`${this.baseUrl}/${id}/documents/additional_letter`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        );
      }

      await Promise.all(uploadPromises);
      // Fetch updated training
      return await this.getById(id);
    }

    return training;
  }

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }

  async uploadDocument(
    id: string,
    documentType: 'trip_report' | 'photos' | 'attendance' | 'additional_letter',
    files: File[]
  ): Promise<Training> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    
    await axios.post(`${this.baseUrl}/${id}/documents/${documentType}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    return await this.getById(id);
  }

  async deleteDocument(
    id: string,
    documentType: 'trip_report' | 'photos' | 'attendance' | 'additional_letter',
    fileName: string
  ): Promise<Training> {
    await axios.delete(`${this.baseUrl}/${id}/documents/${documentType}/${fileName}`);
    return await this.getById(id);
  }
}

export const trainingService = new TrainingService();
