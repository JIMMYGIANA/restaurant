import { Directive, OnDestroy, Output } from "@angular/core";
import { Observable, PartialObserver, Subject, isObservable } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive()
export abstract class ReactiveComponent implements OnDestroy {

    private readonly _destructionTrigger$$ = new Subject<void>();
    @Output() public readonly destroyed$ = this._destructionTrigger$$.asObservable();

    constructor() { }

    public ngOnDestroy(): void {
        this._destructionTrigger$$.next();
        this._destructionTrigger$$.complete();
    }

    protected subscribe<T>(observable: Observable<T>): void;
    protected subscribe<T>(observables: Observable<T>[]): void;
    protected subscribe(observables: Observable<unknown>[]): void;
    protected subscribe<T>(observable: Observable<T>, observer?: PartialObserver<T>): void;
    protected subscribe<T>(observables: Observable<T>[], observer?: PartialObserver<T>): void;
    protected subscribe(observables: Observable<unknown>[], observer?: PartialObserver<unknown>): void;
    protected subscribe<T>(oneOrMoreObservables: Observable<T> | Observable<T>[], observer?: PartialObserver<T>): void {

        if (oneOrMoreObservables == null)
            throw new Error('Observable/s not defined.');

        if (isObservable(oneOrMoreObservables)) {
            oneOrMoreObservables.pipe(takeUntil(this.destroyed$)).subscribe(observer);
            return;
        }
        if (oneOrMoreObservables instanceof Array) {
            for (const observable of oneOrMoreObservables) {
                this.subscribe(observable, observer);
            }
            return;
        }
        throw new Error('Unsupported type.');
    }
}