### Desafio Técnico: Agendamento de Consultas Online

O objetivo deste desafio é desenvolver uma API que simule o agendamento de consultas, utilizando um fluxo assíncrono para processar as requisições. O teste avalia a habilidade do candidato em trabalhar com **NestJS**, **Typescript**, **AWS SQS** e **filas**, além de modelagem de dados com **Prisma**.

---

### Requisitos

#### 1. Tecnologia e Configuração

* **Linguagem**: TypeScript
* **Framework**: NestJS
* **Gerenciador de Pacotes**: Bun
* **Banco de Dados**: PostgreSQL (ou similar)
* **ORM**: Prisma
* **Mensageria/Fila**: AWS SQS

---

#### 2. Fluxo de Agendamento

A API deve ter um endpoint principal para agendar consultas (`POST /appointments`). Ao receber uma requisição, a API não deve salvar a consulta no banco de dados imediatamente. Em vez disso, ela deve publicar uma mensagem em uma fila do **AWS SQS**.

Um serviço de consumidor (consumer) deve ser responsável por processar as mensagens dessa fila. O consumidor deve:
* Validar se o horário e a data estão disponíveis para o psicólogo.
* Se a validação for aprovada, salvar a consulta no banco de dados.

---

#### Requisitos para a vaga

1.  **Endpoints**:
    * `POST /appointments`: Cria um novo agendamento. Retorne uma resposta rápida (`202 Accepted`) após publicar a mensagem na fila.

2.  **Lógica de Fila**:
    * O endpoint `POST /appointments` deve publicar uma mensagem para uma fila do **SQS**.
    * Crie um serviço que "escuta" essa fila.
    * A lógica de negócio deve residir no consumidor, que é quem valida e persiste os dados.

3.  **Validação**:
    * No consumidor, verifique a disponibilidade do psicólogo para o agendamento.

---

#### Extras

1.  **Notificações e Retorno**:
    * Após o processamento da fila, o consumidor deve emitir uma notificação (pode ser um log) para o cliente, informando se a consulta foi `confirmed` ou `declined`.
    * Se a consulta for `confirmed`, a notificação deve ser `Your appointment has been confirmed.`.
    * Se for `declined` (por indisponibilidade), a notificação deve ser `Sorry, the time you chose is no longer available.`.

2.  **Validações de Negócio Adicionais**:
    * Inclua uma validação que impeça agendamentos com menos de 24 horas de antecedência.
    * Adicione uma validação que considere o horário de trabalho do psicólogo (e.g., segunda a sexta, das 8h às 18h).

3.  **Tratamento de Erros e Logs**:
    * Implemente um sistema de retentativa para mensagens que falharem ao serem processadas.
    * Utilize um logger para registrar as etapas do processo: recebimento da requisição, publicação na fila e resultado do processamento.

---

### Entrega

* Um repositório no GitHub com o projeto completo.
* Um arquivo `README.md` detalhado, contendo:
    * Instruções claras sobre como configurar e executar o projeto.
    * Explicação das escolhas de arquitetura e design.
    * **Justificativa da escolha do SQS, comparando-o a um broker como RabbitMQ**.
    * Exemplo de payload para o endpoint `POST /appointments`.

---

### Critérios de Avaliação

* **Qualidade do Código**: Legibilidade, organização, convenções de código e uso correto de TypeScript.
* **Arquitetura**: Separação de responsabilidades, modularização e uso de design patterns.
* **Gerenciamento de Assincronismo**: Uso eficiente e correto de filas e mensageria.
* **Testes**: Cobertura de testes unitários e de integração (um grande diferencial).
* **Modelagem de Dados**: Como as entidades e seus relacionamentos foram definidos para resolver o problema.
