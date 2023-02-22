import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'ktbz-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	@Output()
	onClose = new EventEmitter<void>();

  selectedMethod: 'traditional' | 'faceId' | 'liveFaceId' = 'traditional';
  selectMethod(method: 'traditional' | 'faceId' | 'liveFaceId') {
    this.selectedMethod = method;
  }

	constructor(private builder: FormBuilder) {}

	standardLoginForm = this.builder.group({
		username: ['', Validators.required],
		password: ['', Validators.required],
	});

	close() {
		this.onClose.emit();
	}

	ngOnInit(): void {}

  isActive(method: 'traditional' | 'faceId' | 'liveFaceId') {
    return method === this.selectedMethod;
  }
}
