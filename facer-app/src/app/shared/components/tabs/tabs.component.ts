import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'ktbz-tabs',
	templateUrl: './tabs.component.html',
	styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
	@Input()
	tabs: { value: string, displayValue: string}[] = [];

  @Output()
  onTabSelection = new EventEmitter<string>();

	activeTab = this.tabs[0];

	constructor() {}

	ngOnInit(): void {
    this.activeTab = this.tabs[0]
  }

	isActive(tab: { value: string, displayValue: string}) {
		return this.activeTab.value === tab.value;
	}

	setActive(tab: { value: string, displayValue: string}) {
		this.activeTab = tab;
    this.onTabSelection.emit(tab.value);
	}
}
