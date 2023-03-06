import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ktbz-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrls: ['./login-wrapper.component.scss']
})
export class LoginWrapperComponent implements OnInit {

  @Output()
  onChangeForm = new EventEmitter<void>();

  tabs = [
    {
      value: 'traditional',
      displayValue: 'Traditional'
    },
    {
      value: 'faceId',
      displayValue: 'Face ID'
    }
  ]

  selectedLoginMethod = this.tabs[0].value;

  selectLoginMethod(method: string) {
    this.selectedLoginMethod = method;
  }

  constructor() { }

  ngOnInit(): void {
  }

  switchToRegisterForm() {

    this.onChangeForm.emit();
  }

}
