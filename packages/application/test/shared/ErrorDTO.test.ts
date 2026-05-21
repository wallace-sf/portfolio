import { describe, expect, it } from 'vitest';

import { DomainError, ValidationError } from '@repo/core/shared';

import { toErrorDTO } from '../../src/shared/ErrorDTO';

describe('toErrorDTO', () => {
  it('should resolve message from ERROR_MESSAGE for known code and locale', () => {
    const error = new ValidationError({ code: 'INVALID_SLUG' });
    const dto = toErrorDTO(error, 'en-US');

    expect(dto.code).toBe('INVALID_SLUG');
    expect(dto.message).toContain('kebab-case');
  });

  it('should resolve message in pt-BR locale', () => {
    const error = new ValidationError({ code: 'INVALID_EMAIL' });
    const dto = toErrorDTO(error, 'pt-BR');

    expect(dto.code).toBe('INVALID_EMAIL');
    expect(dto.message).toContain('e-mail');
  });

  it('should resolve message in es locale', () => {
    const error = new ValidationError({ code: 'NOT_FOUND' });
    const dto = toErrorDTO(error, 'es');

    expect(dto.code).toBe('NOT_FOUND');
    expect(dto.message).toContain('encontrado');
  });

  it('should use httpCode for lookup when provided', () => {
    const error = new DomainError('NO_ACCESS_TOKEN');
    const dto = toErrorDTO(error, 'pt-BR', 'AUTH_REQUIRED');

    expect(dto.code).toBe('AUTH_REQUIRED');
    expect(dto.message).toContain('Autenticação');
  });

  it('should fall back to error.message when code is unknown', () => {
    const error = new DomainError('UNKNOWN_CODE', { message: 'Fallback message' });
    const dto = toErrorDTO(error, 'en-US');

    expect(dto.code).toBe('UNKNOWN_CODE');
    expect(dto.message).toBe('Fallback message');
  });

  it('should fall back to en-US when code is missing from requested locale', () => {
    const error = new ValidationError({ code: 'NOT_FOUND' });
    const enDto = toErrorDTO(error, 'en-US');
    const ptDto = toErrorDTO(error, 'pt-BR');

    expect(enDto.message).not.toBe(ptDto.message);
  });

  it('should return code as message of last resort when all lookups fail', () => {
    const error = new DomainError('COMPLETELY_UNKNOWN');
    const dto = toErrorDTO(error, 'en-US');

    expect(dto.code).toBe('COMPLETELY_UNKNOWN');
    expect(dto.message).toBe('COMPLETELY_UNKNOWN');
  });
});
