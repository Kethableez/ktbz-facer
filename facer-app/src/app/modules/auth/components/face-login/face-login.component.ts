import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ktbz-face-login',
  templateUrl: './face-login.component.html',
  styleUrls: ['./face-login.component.scss']
})
export class FaceLoginComponent implements OnInit {

  @Output()
  onFormChange = new EventEmitter<void>();

  modelControl!: FormControl;

  constructor(
    private builder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initControl();
  }

  private initControl() {
    this.modelControl = this.builder.nonNullable.control(null, Validators.required);
  }

  submit() {

  }

  switchToRegisterForm() {
    this.onFormChange.emit();
  }

}
