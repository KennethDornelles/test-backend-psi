import { AppointmentRequest } from '../../domain/value-objects/appointment-request.vo';

export interface IQueueService {
  publishAppointmentRequest(
    appointmentRequest: AppointmentRequest,
  ): Promise<string>;
  consumeAppointmentRequests(): Promise<AppointmentRequest[]>;
  deleteMessage(receiptHandle: string): Promise<void>;
}
