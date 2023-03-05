import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
	@Input()
	tabs = ['First', 'Second', 'Third'];

	activeTab = this.tabs[0];

	constructor() {}

	ngOnInit(): void {}

	isActive(tab: string) {
		return tab === this.activeTab;
	}

	setActive(tab: string) {
		this.activeTab = tab;
	}
}
