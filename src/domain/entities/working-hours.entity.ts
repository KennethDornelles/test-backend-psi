export class WorkingHours {
  constructor(
    public readonly id: string,
    public readonly startTime: string, // "08:00"
    public readonly endTime: string, // "18:00"
    public readonly workDays: number[], // [1,2,3,4,5] - Segunda a Sexta
    public readonly psychologistId?: string,
    public readonly doctorId?: string,
    public readonly lunchStart?: string, // "12:00"
    public readonly lunchEnd?: string, // "13:00"
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id?: string;
    psychologistId?: string;
    doctorId?: string;
    startTime: string;
    endTime: string;
    workDays: number[];
    lunchStart?: string;
    lunchEnd?: string;
  }): WorkingHours {
    return new WorkingHours(
      data.id || '',
      data.startTime,
      data.endTime,
      data.workDays,
      data.psychologistId,
      data.doctorId,
      data.lunchStart,
      data.lunchEnd,
    );
  }

  isWorkingDay(dayOfWeek: number): boolean {
    return this.workDays.includes(dayOfWeek);
  }

  isWithinWorkingHours(time: string): boolean {
    return time >= this.startTime && time <= this.endTime;
  }

  isLunchTime(time: string): boolean {
    if (!this.lunchStart || !this.lunchEnd) {
      return false;
    }
    return time >= this.lunchStart && time <= this.lunchEnd;
  }

  isAvailableAt(time: string, dayOfWeek: number): boolean {
    return (
      this.isWorkingDay(dayOfWeek) &&
      this.isWithinWorkingHours(time) &&
      !this.isLunchTime(time)
    );
  }
}
