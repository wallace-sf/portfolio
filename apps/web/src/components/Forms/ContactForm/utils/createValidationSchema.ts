import { object, string } from 'yup';

type CreateValidationSchemaParams = {
  message: { required: string; min: string };
};

export const createValidationSchema = ({
  message,
}: CreateValidationSchemaParams) => {
  return object({
    message: string().required(message.required).min(3, message.min),
  });
};
