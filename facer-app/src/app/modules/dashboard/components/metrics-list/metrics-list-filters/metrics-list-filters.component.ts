import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { uniq } from 'lodash';
import { Metrics } from '../../../models/metrics.model';

@Component({
	selector: 'ktbz-metrics-list-filters',
	templateUrl: './metrics-list-filters.component.html',
	styleUrls: ['./metrics-list-filters.component.scss'],
})
export class MetricsListFiltersComponent implements OnInit {
	@Input()
	metricsList: Metrics[] = [];

	@Output()
	filteredMetrics = new EventEmitter<Metrics[]>();

	filtersForm!: FormGroup;

	get authTypeData() {
		return uniq(this.metricsList.map((metrics: any) => metrics.type));
	}

	get modelNameData() {
		return ['-', ...uniq(this.metricsList.map((metrics: any) => metrics.additionalData).filter(v => v !== '-'))];
	}

	get sortByData() {
		return ['date-desc', 'date-asc', 'time-desc', 'time-asc'];
	}

	constructor(private builder: FormBuilder) {}

	ngOnInit(): void {
		this.initForm();
		this.watch();
		// this.applyFilters();
	}

	private initForm() {
		this.filtersForm = this.builder.group({
			authType: [null],
			modelName: [null],
			sortBy: ['date-desc'],
		});
	}

	getControl(controlName: string) {
		return this.filtersForm.controls[controlName] as FormControl;
	}

	clear() {
		this.filtersForm.reset({
			authType: null,
			modelName: null,
			sortBy: this.getControl('sortBy').value,
		});
	}

	authTypeDataTransform(data: string) {
		const dict: { [key: string]: string } = {
			'std-login': 'Standard login',
			'face-login': 'Face login',
		};

		return dict[data];
	}

	modelDataTransform(data: string) {
		const dict: { [key: string]: string } = {
			dlib: 'DLIB',
			'-': 'None',
		};

		return dict[data];
	}

	sortingDataTransform(data: string) {
		const dict: { [key: string]: string } = {
			'date-desc': 'By latest date',
			'date-asc': 'By oldest date',
			'time-desc': 'By longest time',
			'time-asc': 'By fastest time',
		};

		return dict[data];
	}

	private watch() {
		this.getControl('authType').valueChanges.subscribe(() => this.applyFilters());
		this.getControl('modelName').valueChanges.subscribe(() => this.applyFilters());
		this.getControl('sortBy').valueChanges.subscribe(() => this.applyFilters());
	}

	private applyFilters() {
		const filtered = this.metricsList.filter((metric: any) => this.filterByModel(metric) && this.filterByAdditionalData(metric));
		const f = filtered.sort((a, b) => this.sortFn(a, b));
		this.filteredMetrics.emit(f);
	}

	private sortFn(a: Metrics, b: Metrics) {
		const [type, direction] = this.getControl('sortBy').value.split('-');
		if (type === 'time') return this.sortByTime(a, b, direction);
		else return this.sortByDate(a, b, direction);
	}

	private sortByDate(a: Metrics, b: Metrics, direction: 'asc' | 'desc') {
		if (direction === 'asc') return a.createdAt < b.createdAt ? -1 : 1;
		else return a.createdAt > b.createdAt ? -1 : 1;
	}

	private sortByTime(a: Metrics, b: Metrics, direction: 'asc' | 'desc') {
		if (direction === 'asc') {
			if (a.ellapsedTime[0] > b.ellapsedTime[0]) return 1;
			else if (a.ellapsedTime[0] === b.ellapsedTime[0]) {
				if (a.ellapsedTime[1] > b.ellapsedTime[1]) return 1;
				else if (a.ellapsedTime[1] === b.ellapsedTime[1]) return 0;
				else return -1;
			} else return -1;
		} else {
			if (a.ellapsedTime[0] > b.ellapsedTime[0]) return -1;
			else if (a.ellapsedTime[0] === b.ellapsedTime[0]) {
				if (a.ellapsedTime[1] > b.ellapsedTime[1]) return -1;
				else if (a.ellapsedTime[1] === b.ellapsedTime[1]) return 0;
				else return 1;
			} else return 1;
		}
	}

	private filterByModel(metric: any) {
		const value = this.getControl('modelName').value;
		return value ? metric.additionalData === value : true;
	}

	private filterByAdditionalData(metric: any) {
		const value = this.getControl('authType').value;
		return value ? metric.type === value : true;
	}
}
