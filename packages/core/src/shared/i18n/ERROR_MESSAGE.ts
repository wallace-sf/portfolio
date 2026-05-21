import type { Locale } from './Locale';

export type ErrorMessageEntry = { message: string };
export type ErrorMessageMap = Record<string, ErrorMessageEntry>;

export const ERROR_MESSAGE: Record<Locale, ErrorMessageMap> = {
  'en-US': {
    // Shared Kernel — Value Objects
    INVALID_SLUG: {
      message:
        'Slug must be kebab-case (lowercase letters, digits, and hyphens only), between 3 and 100 characters.',
    },
    INVALID_NAME: { message: 'Name must be between 3 and 100 characters.' },
    INVALID_TEXT: {
      message: 'Text does not meet the required length constraints.',
    },
    INVALID_EMAIL: { message: 'Invalid email address format.' },
    INVALID_URL: { message: 'Invalid URL format.' },
    INVALID_ID: { message: 'Id must be a valid UUID.' },
    INVALID_DATE_RANGE: {
      message: 'Invalid date range: start date must not be after end date.',
    },
    INVALID_DATE_TIME: { message: 'Invalid date or time value.' },
    INVALID_LOCALIZED_TEXT: {
      message: 'Localized text requires a non-empty en-US value.',
    },

    // Portfolio context — entities
    INVALID_PROJECT: { message: 'Invalid project data.' },
    INVALID_EXPERIENCE: { message: 'Invalid experience data.' },
    INVALID_SKILL: { message: 'Invalid skill data.' },
    ERROR_INVALID_SKILL_LIST: {
      message: 'One or more skills in the list are invalid.',
    },
    INVALID_LANGUAGE: { message: 'Invalid language data.' },
    INVALID_LOCALE: { message: 'Unsupported locale.' },
    INVALID_PROFESSIONAL_VALUE: { message: 'Invalid professional value data.' },
    INVALID_PROFILE_STAT: { message: 'Invalid profile stat data.' },
    INVALID_SOCIAL_NETWORK: { message: 'Invalid social network data.' },
    TOO_MANY_FEATURED_PROJECTS: {
      message: 'A profile can feature at most 6 projects.',
    },

    // Identity context
    INVALID_USER: { message: 'Invalid user data.' },

    // Error infrastructure
    VALIDATION_ERROR: { message: 'Validation failed.' },
    NOT_FOUND: { message: 'Resource not found.' },
    UNAUTHORIZED: {
      message: 'You do not have permission to perform this action.',
    },
    AUTH_REQUIRED: { message: 'Authentication required. Please sign in.' },
    AUTH_INVALID_CREDENTIALS: { message: 'Invalid email or password.' },
    AUTH_SUBJECT_CONFLICT: {
      message: 'This email is already linked to another account.',
    },
    INTERNAL_ERROR: {
      message: 'An unexpected error occurred. Please try again later.',
    },
  },

  'pt-BR': {
    // Shared Kernel — Value Objects
    INVALID_SLUG: {
      message:
        'Slug deve estar em kebab-case (letras minúsculas, dígitos e hífens), com 3 a 100 caracteres.',
    },
    INVALID_NAME: { message: 'O nome deve ter entre 3 e 100 caracteres.' },
    INVALID_TEXT: {
      message: 'O texto não atende às restrições de tamanho exigidas.',
    },
    INVALID_EMAIL: { message: 'Formato de e-mail inválido.' },
    INVALID_URL: { message: 'Formato de URL inválido.' },
    INVALID_ID: { message: 'O id deve ser um UUID válido.' },
    INVALID_DATE_RANGE: {
      message:
        'Intervalo de datas inválido: a data de início não pode ser posterior à data de fim.',
    },
    INVALID_DATE_TIME: { message: 'Data ou hora inválida.' },
    INVALID_LOCALIZED_TEXT: {
      message: 'O texto localizado requer um valor pt-BR não vazio.',
    },

    // Portfolio context — entities
    INVALID_PROJECT: { message: 'Dados do projeto inválidos.' },
    INVALID_EXPERIENCE: { message: 'Dados da experiência inválidos.' },
    INVALID_SKILL: { message: 'Dados da habilidade inválidos.' },
    ERROR_INVALID_SKILL_LIST: {
      message: 'Uma ou mais habilidades na lista são inválidas.',
    },
    INVALID_LANGUAGE: { message: 'Dados do idioma inválidos.' },
    INVALID_LOCALE: { message: 'Locale não suportado.' },
    INVALID_PROFESSIONAL_VALUE: {
      message: 'Dados do valor profissional inválidos.',
    },
    INVALID_PROFILE_STAT: {
      message: 'Dados da estatística do perfil inválidos.',
    },
    INVALID_SOCIAL_NETWORK: { message: 'Dados da rede social inválidos.' },
    TOO_MANY_FEATURED_PROJECTS: {
      message: 'Um perfil pode ter no máximo 6 projetos em destaque.',
    },

    // Identity context
    INVALID_USER: { message: 'Dados do utilizador inválidos.' },

    // Error infrastructure
    VALIDATION_ERROR: { message: 'Falha na validação.' },
    NOT_FOUND: { message: 'Recurso não encontrado.' },
    UNAUTHORIZED: {
      message: 'Você não tem permissão para realizar esta ação.',
    },
    AUTH_REQUIRED: {
      message: 'Autenticação necessária. Por favor, faça login.',
    },
    AUTH_INVALID_CREDENTIALS: { message: 'E-mail ou senha inválidos.' },
    AUTH_SUBJECT_CONFLICT: {
      message: 'Este e-mail já está vinculado a outra conta.',
    },
    INTERNAL_ERROR: {
      message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    },
  },

  es: {
    // Shared Kernel — Value Objects
    INVALID_SLUG: {
      message:
        'El slug debe estar en kebab-case (letras minúsculas, dígitos y guiones), entre 3 y 100 caracteres.',
    },
    INVALID_NAME: { message: 'El nombre debe tener entre 3 y 100 caracteres.' },
    INVALID_TEXT: {
      message:
        'El texto no cumple con las restricciones de longitud requeridas.',
    },
    INVALID_EMAIL: { message: 'Formato de correo electrónico inválido.' },
    INVALID_URL: { message: 'Formato de URL inválido.' },
    INVALID_ID: { message: 'El id debe ser un UUID válido.' },
    INVALID_DATE_RANGE: {
      message:
        'Rango de fechas inválido: la fecha de inicio no puede ser posterior a la fecha de fin.',
    },
    INVALID_DATE_TIME: { message: 'Fecha u hora inválida.' },
    INVALID_LOCALIZED_TEXT: {
      message: 'El texto localizado requiere un valor pt-BR no vacío.',
    },

    // Portfolio context — entities
    INVALID_PROJECT: { message: 'Datos del proyecto inválidos.' },
    INVALID_EXPERIENCE: { message: 'Datos de la experiencia inválidos.' },
    INVALID_SKILL: { message: 'Datos de la habilidad inválidos.' },
    ERROR_INVALID_SKILL_LIST: {
      message: 'Una o más habilidades de la lista son inválidas.',
    },
    INVALID_LANGUAGE: { message: 'Datos del idioma inválidos.' },
    INVALID_LOCALE: { message: 'Configuración regional no compatible.' },
    INVALID_PROFESSIONAL_VALUE: {
      message: 'Datos del valor profesional inválidos.',
    },
    INVALID_PROFILE_STAT: {
      message: 'Datos de la estadística del perfil inválidos.',
    },
    INVALID_SOCIAL_NETWORK: { message: 'Datos de la red social inválidos.' },
    TOO_MANY_FEATURED_PROJECTS: {
      message: 'Un perfil puede destacar como máximo 6 proyectos.',
    },

    // Identity context
    INVALID_USER: { message: 'Datos del usuario inválidos.' },

    // Error infrastructure
    VALIDATION_ERROR: { message: 'Error de validación.' },
    NOT_FOUND: { message: 'Recurso no encontrado.' },
    UNAUTHORIZED: { message: 'No tiene permiso para realizar esta acción.' },
    AUTH_REQUIRED: {
      message: 'Autenticación requerida. Por favor, inicie sesión.',
    },
    AUTH_INVALID_CREDENTIALS: {
      message: 'Correo electrónico o contraseña inválidos.',
    },
    AUTH_SUBJECT_CONFLICT: {
      message: 'Este correo electrónico ya está vinculado a otra cuenta.',
    },
    INTERNAL_ERROR: {
      message: 'Ocurrió un error inesperado. Por favor, inténtelo de nuevo.',
    },
  },
};

/**
 * Resolves a localized error message for a given error code.
 * Fallback chain: requested locale → en-US → pt-BR → undefined.
 */
export function getErrorMessage(
  locale: Locale,
  code: string,
): string | undefined {
  return (
    ERROR_MESSAGE[locale]?.[code]?.message ??
    ERROR_MESSAGE['en-US']?.[code]?.message ??
    ERROR_MESSAGE['pt-BR']?.[code]?.message
  );
}
