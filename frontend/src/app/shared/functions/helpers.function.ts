import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export interface IResponse<T> {
  results?: T;
  errors?: HttpErrorResponse;
}

type ErrorFunction = (arg: any) => void;

export function observe<T>(
  source: Observable<T>,
  onError?: ErrorFunction,
): Observable<IResponse<T>> {
  return source.pipe(
    map((data: T) => {
      return { results: data } as IResponse<T>;
    }),
    catchError((err) => {
      if (onError) {
        onError(err);
      }
      let error = 'Bad Request';
      if (err.status !== 400) {
        error = err.message;
      }
      return of({ errors: err }) as Observable<IResponse<T>>;
    }),
  );
}

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value || '';

  const passwordValidation = {
    hasDigit: RegExp(/[0-9]/).test(value),
    hasLowerCase: RegExp(/[a-z]/).test(value),
    hasUpperCase: RegExp(/[A-Z]/).test(value),
    hasSpecialChar: RegExp(/[!@#$%^&*(),.?":{}|<>]/).test(value),
    isLongEnough: value.length >= 12
  };

  const isValid = Object.values(passwordValidation).every(Boolean);

  return isValid ? null : { passwordStrength: passwordValidation };
}