/**
 * Local enum definitions mirroring the Prisma schema.
 * Imported by all services/controllers/DTOs instead of @prisma/client
 * to avoid pnpm isolation resolution issues.
 */

export enum UserRole {
  CLIENT = 'CLIENT',
  PRESTATAIRE = 'PRESTATAIRE',
  ADMIN = 'ADMIN',
}

export enum ProviderStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  SUSPENDED = 'SUSPENDED',
}

export enum EventType {
  MARIAGE = 'MARIAGE',
  FIANCES = 'FIANCES',
  BAPTEME = 'BAPTEME',
  ANNIVERSAIRE = 'ANNIVERSAIRE',
  CONFERENCE = 'CONFERENCE',
  SOIREE = 'SOIREE',
  SEMINAIRE = 'SEMINAIRE',
  AUTRE = 'AUTRE',
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PLANNING = 'PLANNING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum QuoteReqStatus {
  PENDING = 'PENDING',
  QUOTED = 'QUOTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum QuoteStatus {
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum RsvpStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  MAYBE = 'MAYBE',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}
