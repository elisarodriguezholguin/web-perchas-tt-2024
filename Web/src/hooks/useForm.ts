import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";

type FormState<T> = {
  [K in keyof T]: string;
};

type FormValidations<T> = {
  [K in keyof T]: [(value: string) => boolean, string];
};

type FormWithValidation<T> = FormState<T> & {
  onInputChange: ({ target }: ChangeEvent<HTMLInputElement>) => void;
  onResetForm: () => void;
  isFormValid: boolean;
  formState: FormState<T>;
} & {
  [K in keyof T as `${K & string}Valid`]: string | undefined;
};

export const useForm = <T extends Record<string, string>>(
  initialForm: T,
  formValidations?: FormValidations<T>
): FormWithValidation<T> => {
  const [formState, setFormState] = useState<FormState<T>>(initialForm);
  const [formValidation, setFormValidation] = useState<
    Partial<{ [K in keyof T]: string | undefined }>
  >({});

  const isFormValid = useMemo(() => {
    return Object.values(formValidation).every((value) => value === undefined);
  }, [formValidation]);

  const onInputChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = target;
      setFormState({
        ...formState,
        [name]: value,
      });
    },
    [formState]
  );

  const onResetForm = useCallback(() => {
    setFormState(initialForm);
  }, [initialForm]);

  useEffect(() => {
    if (formValidations) {
      const newValidation: Partial<{ [K in keyof T]: string | undefined }> = {};
      for (const [field, [validationFn, errorMessage]] of Object.entries(
        formValidations
      )) {
        newValidation[`${field}Valid` as keyof T] = validationFn(
          formState[field]
        )
          ? undefined
          : errorMessage;
      }
      setFormValidation(newValidation);
    } else {
      setFormValidation({});
    }
  }, [formState, formValidations]);

  return {
    formState,
    ...formState,
    onInputChange,
    onResetForm,
    isFormValid,
    ...formValidation,
  } as FormWithValidation<T>;
};
