import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ktbz-traditional-login',
  templateUrl: './traditional-login.component.html',
  styleUrls: ['./traditional-login.component.scss']
})
export class TraditionalLoginComponent implements OnInit {

  loginForm!: FormGroup;

  @Output()
  onChangeForm = new EventEmitter<void>();

  constructor(
    private builder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  private initForm() {
    this.loginForm = this.builder.nonNullable.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    })
  }

  getControl(controlName: string): FormControl {
    return this.loginForm.controls[controlName] as FormControl;
  }

  submitForm() {
    const payload = this.loginForm.value as { username: string, password: string};
    console.log('submitted', payload)
  }

  switchToCreateAccount() {
    this.onChangeForm.emit();
  }

}
