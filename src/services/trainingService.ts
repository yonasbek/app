import api from '@/utils/api';
import {
  Course,
  CourseFormData,
  CourseFilters,
  // CourseSearchResponse,
  CourseStatistics,
  Trainer,
  TrainerFormData,
  TrainerFilters,
  // TrainerSearchResponse,
  TrainerStatistics,
  Trainee,
  TraineeFormData,
  TraineeFilters,
  // TraineeSearchResponse,
  TraineeStatistics,
  CourseEnrollment,
  EnrollmentFormData,
  EnrollmentFilters,
  // EnrollmentSearchResponse,
  EnrollmentStatistics,
  AssignTrainerFormData
} from '@/types/training';

class TrainingService {
  private baseUrl = '';

  // ==================== COURSES ====================

  async getAllCourses(filters?: CourseFilters): Promise<Course[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.level) params.append('level', filters.level);

      const queryString = params.toString();
      const url = queryString ? `/courses?${queryString}` : `/courses`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  async getCourseById(id: string): Promise<Course> {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  async createCourse(data: CourseFormData): Promise<Course> {
    try {
      const response = await api.post(`${this.baseUrl}/courses`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(id: string, data: Partial<CourseFormData>): Promise<Course> {
    try {
      const response = await api.patch(`${this.baseUrl}/courses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/courses/${id}`);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  async getCourseStats(id: string): Promise<CourseStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/courses/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course stats:', error);
      throw error;
    }
  }

  async assignTrainersToCourse(courseId: string, trainerIds: string[]): Promise<Course> {
    try {
      const response = await api.post(`${this.baseUrl}/courses/${courseId}/assign-trainers`, {
        course_id: courseId,
        trainer_ids: trainerIds
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning trainers to course:', error);
      throw error;
    }
  }

  async removeTrainerFromCourse(courseId: string, trainerId: string): Promise<Course> {
    try {
      const response = await api.delete(`${this.baseUrl}/courses/${courseId}/trainers/${trainerId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing trainer from course:', error);
      throw error;
    }
  }

  // ==================== TRAINERS ====================

  async getAllTrainers(filters?: TrainerFilters): Promise<Trainer[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.specialization) params.append('specialization', filters.specialization);
      // if (filters?.available) params.append('available', filters.available.toString());
      // if (filters?.courseId) params.append('courseId', filters.courseId);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}/trainers?${queryString}` : `${this.baseUrl}/trainers`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainers:', error);
      throw error;
    }
  }

  async getTrainerById(id: string): Promise<Trainer> {
    try {
      const response = await api.get(`${this.baseUrl}/trainers/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer:', error);
      throw error;
    }
  }

  async createTrainer(data: TrainerFormData): Promise<Trainer> {
    try {
      const response = await api.post(`${this.baseUrl}/trainers`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating trainer:', error);
      throw error;
    }
  }

  async updateTrainer(id: string, data: Partial<TrainerFormData>): Promise<Trainer> {
    try {
      const response = await api.patch(`${this.baseUrl}/trainers/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating trainer:', error);
      throw error;
    }
  }

  async deleteTrainer(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/trainers/${id}`);
    } catch (error) {
      console.error('Error deleting trainer:', error);
      throw error;
    }
  }

  async getTrainerStats(id: string): Promise<TrainerStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/trainers/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainer stats:', error);
      throw error;
    }
  }

  async getAvailableTrainers(courseId?: string): Promise<Trainer[]> {
    try {
      const params = courseId ? `?courseId=${courseId}` : '';
      const response = await api.get(`${this.baseUrl}/trainers?available=true${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available trainers:', error);
      throw error;
    }
  }

  // ==================== TRAINEES ====================

  async getAllTrainees(filters?: TraineeFilters): Promise<Trainee[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.organization) params.append('organization', filters.organization);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}/trainees?${queryString}` : `${this.baseUrl}/trainees`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainees:', error);
      throw error;
    }
  }

  async getTraineeById(id: string): Promise<Trainee> {
    try {
      const response = await api.get(`${this.baseUrl}/trainees/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainee:', error);
      throw error;
    }
  }

  async createTrainee(data: TraineeFormData): Promise<Trainee> {
    try {
      const response = await api.post(`${this.baseUrl}/trainees`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating trainee:', error);
      throw error;
    }
  }

  async updateTrainee(id: string, data: Partial<TraineeFormData>): Promise<Trainee> {
    try {
      const response = await api.patch(`${this.baseUrl}/trainees/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating trainee:', error);
      throw error;
    }
  }

  async deleteTrainee(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/trainees/${id}`);
    } catch (error) {
      console.error('Error deleting trainee:', error);
      throw error;
    }
  }

  async getTraineeStats(id: string): Promise<TraineeStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/trainees/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trainee stats:', error);
      throw error;
    }
  }

  // ==================== ENROLLMENTS ====================

  async getAllEnrollments(filters?: EnrollmentFilters): Promise<CourseEnrollment[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      // if (filters?.courseId) params.append('courseId', filters.courseId);
      // if (filters?.traineeId) params.append('traineeId', filters.traineeId);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}/enrollments?${queryString}` : `${this.baseUrl}/enrollments`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  }

  async getEnrollmentById(id: string): Promise<CourseEnrollment> {
    try {
      const response = await api.get(`${this.baseUrl}/enrollments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment:', error);
      throw error;
    }
  }

  async enrollTrainee(data: EnrollmentFormData): Promise<CourseEnrollment> {
    try {
      const response = await api.post(`${this.baseUrl}/enrollments`, data);
      return response.data;
    } catch (error) {
      console.error('Error enrolling trainee:', error);
      throw error;
    }
  }

  async updateEnrollment(id: string, data: Partial<EnrollmentFormData>): Promise<CourseEnrollment> {
    try {
      const response = await api.patch(`${this.baseUrl}/enrollments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating enrollment:', error);
      throw error;
    }
  }

  async deleteEnrollment(id: string): Promise<void> {
    try {
      await api.delete(`${this.baseUrl}/enrollments/${id}`);
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      throw error;
    }
  }

  async confirmEnrollment(id: string): Promise<CourseEnrollment> {
    try {
      const response = await api.patch(`${this.baseUrl}/enrollments/${id}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Error confirming enrollment:', error);
      throw error;
    }
  }

  async cancelEnrollment(id: string): Promise<CourseEnrollment> {
    try {
      const response = await api.patch(`${this.baseUrl}/enrollments/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling enrollment:', error);
      throw error;
    }
  }

  async getEnrollmentStats(): Promise<EnrollmentStatistics> {
    try {
      const response = await api.get(`${this.baseUrl}/enrollments/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollment stats:', error);
      throw error;
    }
  }

  // ==================== UTILITY METHODS ====================

  async searchCourses(query: string): Promise<Course[]> {
    try {
      const response = await api.get(`${this.baseUrl}/courses?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  async searchTrainers(query: string): Promise<Trainer[]> {
    try {
      const response = await api.get(`${this.baseUrl}/trainers?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching trainers:', error);
      throw error;
    }
  }

  async searchTrainees(query: string): Promise<Trainee[]> {
    try {
      const response = await api.get(`${this.baseUrl}/trainees?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching trainees:', error);
      throw error;
    }
  }

  // ==================== BULK OPERATIONS ====================

  // async bulkEnrollTrainees(courseId: string, traineeIds: string[]): Promise<CourseEnrollment[]> {
  //   try {
  //     const enrollments = await Promise.all(
  //       traineeIds.map(traineeId => 
  //         this.enrollTrainee({
  //           course_id: courseId,
  //           trainee_id: traineeId
  //         })
  //       )
  //     );
  //     return enrollments;
  //   } catch (error) {
  //     console.error('Error bulk enrolling trainees:', error);
  //     throw error;
  //   }
  // }

  async bulkUpdateEnrollments(enrollmentIds: string[], updates: Partial<EnrollmentFormData>): Promise<CourseEnrollment[]> {
    try {
      const enrollments = await Promise.all(
        enrollmentIds.map(id => this.updateEnrollment(id, updates))
      );
      return enrollments;
    } catch (error) {
      console.error('Error bulk updating enrollments:', error);
      throw error;
    }
  }

  // ==================== EXPORT/IMPORT ====================

  async exportCourses(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/courses/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting courses:', error);
      throw error;
    }
  }

  async exportTrainees(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/trainees/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting trainees:', error);
      throw error;
    }
  }

  async exportEnrollments(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    try {
      const response = await api.get(`${this.baseUrl}/enrollments/export?format=${format}`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting enrollments:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  isAdmin(): boolean {
    try {
      const userRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
      return userRole === 'admin' || userRole === 'administrator';
    } catch (error) {
      console.warn('Unable to determine user role, defaulting to admin');
      return true;
    }
  }

  // Format date for API
  formatDateForAPI(date: Date | string | undefined): string | undefined {
    if (!date) return undefined;
    return new Date(date).toISOString();
  }

  // Format date for display
  formatDateForDisplay(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  // Format currency
  formatCurrency(amount: number | undefined): string {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Get status color class
  getStatusColorClass(status: string, type: 'course' | 'enrollment' | 'trainer' | 'trainee'): string {
    const statusColors = {
      course: {
        draft: 'bg-gray-100 text-gray-800',
        published: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      enrollment: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        failed: 'bg-gray-100 text-gray-800'
      },
      trainer: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        on_leave: 'bg-yellow-100 text-yellow-800'
      },
      trainee: {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-100 text-gray-800',
        suspended: 'bg-red-100 text-red-800'
      }
    };

    return statusColors[type]?.[status.toLowerCase() as keyof typeof statusColors[typeof type]] || 'bg-gray-100 text-gray-800';
  }
}

export const trainingService = new TrainingService();
