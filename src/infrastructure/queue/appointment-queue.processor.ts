import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import type { IQueueService } from '../../application/interfaces/queue.service.interface';
import { ProcessAppointmentUseCase } from '../../application/use-cases/process-appointment.use-case';
// AppointmentRequest não é usado diretamente neste arquivo

@Injectable()
export class AppointmentQueueProcessor implements OnModuleInit {
  private readonly logger = new Logger(AppointmentQueueProcessor.name);
  private isProcessing = false;

  constructor(
    @Inject('IQueueService') private readonly queueService: IQueueService,
    private readonly processAppointmentUseCase: ProcessAppointmentUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Iniciando processador de fila de agendamentos');
    void this.startProcessing();
  }

  private async startProcessing() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.logger.log('Processador de fila iniciado');

    while (this.isProcessing) {
      try {
        await this.processMessages();
        // Aguardar 5 segundos antes da próxima verificação
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        this.logger.error(
          `Erro no processador de fila: ${error.message}`,
          error.stack,
        );
        // Aguardar 10 segundos antes de tentar novamente
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    }
  }

  private async processMessages() {
    try {
      const appointmentRequests =
        await this.queueService.consumeAppointmentRequests();

      if (appointmentRequests.length === 0) {
        return;
      }

      this.logger.log(
        `Processando ${appointmentRequests.length} solicitações de agendamento`,
      );

      for (const appointmentRequest of appointmentRequests) {
        try {
          await this.processAppointmentUseCase.execute({
            appointmentRequest,
            messageId: `msg-${Date.now()}`, // Em produção, você obteria o ID real da mensagem
          });

          this.logger.log(`Solicitação de agendamento processada com sucesso`);
        } catch (error) {
          this.logger.error(
            `Erro ao processar solicitação de agendamento: ${error.message}`,
            error.stack,
          );
          // Em produção, você implementaria retry logic aqui
        }
      }
    } catch (error) {
      this.logger.error(
        `Erro ao consumir mensagens da fila: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async stopProcessing(): Promise<void> {
    this.logger.log('Parando processador de fila');
    this.isProcessing = false;
  }
}
