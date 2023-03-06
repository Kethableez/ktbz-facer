import { Injectable } from '@angular/core';
import { OnInitEffects, createEffect, ofType, Actions } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { map, switchMap, distinctUntilChanged, tap } from 'rxjs';
import { RootState } from '../root.state';
import { hydrate, hydrateSuccess, hydrateFailure } from './hydration.actions';

@Injectable()
export class HydrationEffects implements OnInitEffects {
  hydrate$ = createEffect(() =>
    this.action$.pipe(
      ofType(hydrate),
      map(() => {
        const storageValue = window.localStorage.getItem('state');
        if (storageValue) {
          try {
            const state = JSON.parse(storageValue);
            return hydrateSuccess({ state });
          } catch {
            window.localStorage.removeItem('state');
          }
        }
        return hydrateFailure();
      })
    )
  );

  serialize$ = createEffect(
    () =>
      this.action$.pipe(
        ofType(hydrateSuccess, hydrateFailure),
        switchMap(() => this.store),
        distinctUntilChanged(),
        tap((state) => window.localStorage.setItem('state', JSON.stringify(state)))
      ),
    { dispatch: false }
  );

  constructor(private action$: Actions, private store: Store<RootState>) {}

  ngrxOnInitEffects(): Action {
    return hydrate();
  }
}
