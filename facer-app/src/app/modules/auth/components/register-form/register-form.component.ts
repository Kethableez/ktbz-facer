import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ktbz-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  @Output()
  onFormChange = new EventEmitter<void>();

  registerForm!: FormGroup;

  constructor(
    private builder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.registerForm = this.builder.nonNullable.group({
      username: [null, Validators.required],
      email: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      useFace: [null, Validators.required],
    })
  }

  getControl(controlName: string): FormControl {
    return this.registerForm.controls[controlName] as FormControl;
  }

  submitForm() {
    const payload = this.registerForm.value as {
      username: string;
      email: string;
      password: string;
      confirmPassword?: string;
      firstName: string;
      lastName: string;
      useFace: boolean
    };
    delete payload.confirmPassword;
    console.log(payload);
  }

  switchToLoginForm() {
    this.onFormChange.emit();
  }

}
