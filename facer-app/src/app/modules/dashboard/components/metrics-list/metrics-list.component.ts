import { Component, OnInit } from '@angular/core';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { RootState } from 'src/app/core/store/root.state';
import { selectMetrics } from '../../store/dashboard.selectors';

@Component({
	selector: 'ktbz-metrics-list',
	templateUrl: './metrics-list.component.html',
	styleUrls: ['./metrics-list.component.scss'],
})
@UntilDestroy()
export class MetricsListComponent implements OnInit {
	itemsPerPage = 5;
	pagination = this.itemsPerPage;

	// metricsList: Metrics[] = [...list, ...list];

	initMetrics: any = [];

	metricsList: any = [];

	metrics$ = this.store$.pipe(select(selectMetrics));

	get metrics() {
		return this.metricsList.slice(0, this.pagination);
	}

	constructor(private store$: Store<RootState>) {}

	ngOnInit(): void {
		this.metrics$
			.pipe(
				untilDestroyed(this),
				filter(data => !!data)
			)
			.subscribe(data => {
				this.initMetrics = data;
				this.onFilter(this.initMetrics);
			});
	}

	getEllapsedTime(data: any) {
		return (data[1] * 1e-6).toFixed(3);
	}

	loadMore() {
		this.pagination = this.pagination + this.itemsPerPage;
	}

	onFilter(filteredMetrics: any) {
		this.metricsList = filteredMetrics;
	}
}
