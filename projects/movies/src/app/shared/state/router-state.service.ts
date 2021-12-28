import { Injectable } from '@angular/core';
import { filter, map, Observable, startWith } from 'rxjs';
import { RxState, select, selectSlice } from '@rx-angular/state';
import { NavigationEnd, Router } from '@angular/router';

export type RouterParams = {
  layout: 'list' | 'detail',
  type: 'person' | 'movie' | 'genre' | 'category' | 'search';
  identifier: string;
};

/**
 * This service maintains the router state and repopulates it to it's subscriber.
 */
@Injectable({
  providedIn: 'root'
})
export class RouterStateService extends RxState<RouterParams> {

  private _routerParams$: Observable<RouterParams> = this.router.events
    .pipe(
      select(
        filter(event => event instanceof NavigationEnd),
        startWith('anyValue'),
        map(_ => {
          // This is a naive way to reduce scripting of router service :)
          // Obviously the params ane not properly managed
          const [layout, type, identifier] = window.location.href.split('/').slice(-3);
          return { layout, type, identifier };
        }),
        // emits if both values are given and set. (filters out undefined values)
        selectSlice(['layout', 'identifier', 'type'])
      )
    ) as unknown as Observable<RouterParams>;
  routerParams$ = this.select();

  constructor(private router: Router) {
    super();
    this.connect(this._routerParams$);
  }
}