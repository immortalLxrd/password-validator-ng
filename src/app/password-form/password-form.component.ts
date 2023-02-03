import { Component } from '@angular/core';
import {
  FormBuilder,
  ValidationErrors,
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

interface IStrengthParams {
  [key: string]: boolean;
}

interface IClassPersence {
  [key: string]: boolean;
}

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent {
  public passwordControl: FormControl = this.formBuilder.control('', [
    Validators.required,
    Validators.minLength(8),
    PasswordFormComponent.passwordStrengthValidator,
  ]);
  public authForm: FormGroup = this.formBuilder.group({
    password: this.passwordControl,
  });

  constructor(private formBuilder: FormBuilder) {}

  public get classPersenceEasy(): IClassPersence {
    return {
      red:
        this.passwordControl.hasError('easy') ||
        this.passwordControl.hasError('minlength'),
      yellow: this.passwordControl.hasError('medium'),
      green: this.passwordControl.hasError('hard'),
    };
  }

  public get classPersenceMedium():IClassPersence {
    return {
      red: this.passwordControl.hasError('minlength'),
      yellow: this.passwordControl.hasError('medium'),
      green: this.passwordControl.hasError('hard'),
    };
  }

  public get classPersenceHard(): IClassPersence {
    return {
      red: this.passwordControl.hasError('minlength'),
      green: this.passwordControl.hasError('hard'),
    };
  }

  private static passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const value: string = control.value;

    if (value.length >= 8) {
      const strengthParams: IStrengthParams = {
        letters: /[A-Za-z]/.test(value),
        digits: /[0-9]/.test(value),
        symbols: /[$-/:-?{-~!"^_`\[\]]/.test(value),
      };

      const strength: number = Object.values(strengthParams).reduce(
        (accum: number, currentValue: boolean): number => {
          if (currentValue) {
            accum++;
          }
          return accum;
        },
        0
      );

      switch (strength) {
        case 1:
          return { easy: true };
        case 2:
          return { medium: true };
        case 3:
          return { hard: true };
      }
    }

    return null;
  }
}
