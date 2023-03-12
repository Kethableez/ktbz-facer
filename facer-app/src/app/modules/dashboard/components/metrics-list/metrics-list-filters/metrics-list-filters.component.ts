import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'ktbz-metrics-list-filters',
	templateUrl: './metrics-list-filters.component.html',
	styleUrls: ['./metrics-list-filters.component.scss'],
})
export class MetricsListFiltersComponent implements OnInit {
	@Input()
	metricsList: any = [];

	@Output()
	filteredMetrics = new EventEmitter<any>();

	constructor(private builder: FormBuilder) {}

	filtersForm!: FormGroup;

	ngOnInit(): void {
		this.initForm();
		this.watch();
	}

	get authTypeData() {
		return this.metricsList.map((metrics: any) => metrics.type);
	}

	get modelNameData() {
		return this.metricsList.map((metrics: any) => metrics.additionalData);
	}

	get sortByData() {
		return ['date-desc', 'date-asc', 'time-taken-desc', 'time-taken-asc'];
	}

	initForm() {
		this.filtersForm = this.builder.group({
			authType: [null],
			modelName: [null],
			sortBy: ['date-desc'],
		});
	}

	getControl(controlName: string) {
		return this.filtersForm.controls[controlName] as FormControl;
	}

	watch() {
		this.getControl('authType').valueChanges.subscribe(() => this.applyFilters());
		this.getControl('modelName').valueChanges.subscribe(() => this.applyFilters());
	}

	applyFilters() {
		const filtered = this.metricsList.filter((metric: any) => this.filterByModel(metric) && this.filterByAdditionalData(metric));
		this.filteredMetrics.emit(filtered);
	}

	filterByModel(metric: any) {
		const value = this.getControl('modelName').value;
		return value ? metric.additionalData === value : true;
	}

	filterByAdditionalData(metric: any) {
		const value = this.getControl('authType').value;
		return value ? metric.type === value : true;
	}

	clear() {
		this.filtersForm.reset();
	}
}
