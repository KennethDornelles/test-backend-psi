import { Injectable, Logger } from '@nestjs/common';
import { INotificationService } from '../../application/interfaces/notification.service.interface';

@Injectable()
export class EmailNotificationService implements INotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  async sendAppointmentConfirmation(
    patientEmail: string,
    patientName: string,
    scheduledAt: Date,
    professionalType: string,
  ): Promise<void> {
    this.logger.log(`Enviando confirmação de agendamento para ${patientEmail}`);

    const formattedDate = scheduledAt.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `Olá ${patientName},

Sua consulta com o ${professionalType} foi confirmada!

📅 Data e Hora: ${formattedDate}

Por favor, chegue com 10 minutos de antecedência.

Atenciosamente,
Equipe PSI`;

    // Aqui você implementaria o envio real de email
    // Por enquanto, apenas logamos a mensagem
    this.logger.log(`Email de confirmação enviado para ${patientEmail}:`);
    this.logger.log(message);

    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  async sendAppointmentDecline(
    patientEmail: string,
    patientName: string,
    scheduledAt: Date,
    reason: string,
  ): Promise<void> {
    this.logger.log(`Enviando recusa de agendamento para ${patientEmail}`);

    const formattedDate = scheduledAt.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `Olá ${patientName},

Infelizmente, não foi possível confirmar sua consulta para ${formattedDate}.

Motivo: ${reason}

Por favor, tente agendar em outro horário disponível.

Atenciosamente,
Equipe PSI`;

    // Aqui você implementaria o envio real de email
    // Por enquanto, apenas logamos a mensagem
    this.logger.log(`Email de recusa enviado para ${patientEmail}:`);
    this.logger.log(message);

    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
