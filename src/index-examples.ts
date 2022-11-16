// Hall2 - labs-hall2

import { Observable, map, count, interval, of, from, mergeMap, asyncScheduler, switchMap, delay, asapScheduler, take, zipAll, buffer, bufferCount, zip, fromEvent, observable, shareReplay, partition, tap, Subscription, Observer, Subject, connectable, ReplaySubject, BehaviorSubject, startWith } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { WebpackOptionsDefaulter } from 'webpack';


// // // [1].map(x => x + 1);

// // const p = new Promise<number>((res) => {
// //   res(1);
// // });

// // p.then(x => x + 1).then(x => x * 2);


// // // [1, 2, 3].map(x => x + 1);

// // const o$ = new Observable<number>((observer) => {
// //   observer.next(1);
// //   observer.next(2);
// //   observer.next(3);
// //   observer.next(4);
// //   observer.error()
// //   setTimeout(() => {
// //     observer.complete()
// //   }, 5000);
// //   return () => {
// //     console.log('Destroy');
// //   };
// // });

// // const sub = o$.pipe(
// //   map(console.log)
// // ).subscribe({
// //   next: (val) => console.log(val),
// //   error: (err) => console.error(err),
// //   complete: () => console.log('Completed')
// // });

// // sub.unsubscribe();


// // // function interval(int: number) {
// // //   return new Observable(observer => {
// // //     let counter = 0;
// // //     const id = setInterval(() => {
// // //       observer.next(counter++);
// // //     }, int);
// // //     return () => {
// // //       clearInterval(id);
// // //     };
// // //   });
// // // }


// // // [1, 2, 3, 4].map(console.log)
// // // [1].map(console.log)

// // of(1, 2, 3, 4).pipe(
// //   take(2),
// //   // switchMap(x => of(x).pipe(delay(1000))),
// // ).subscribe(console.log);
// // from([1, 2, 3, 4]).subscribe(console.log);


// // interval(1000).subscribe(console.log);



// // Promise.resolve(100)
// //   .then(() => Promise.resolve(200))
// //   .then(console.log);

// fetch('https://jsonplaceholder.typicode.com/users').then(
//   (res) => res.ok ? res.json() : Promise.reject(new Error('Error loading users'))
// ).then(
//   users => console.log(users)
// )

// const url = 'https://jsonplaceholder.typicode.com';

// const getUsers$ = of('/users', '/posts', '/comments').pipe(
//   map(path => url + path),
//   bufferCount(3),
//   mergeMap(urls => zip(urls.map(reqUrl => fromFetch(reqUrl)))),
//   mergeMap(res => zip(res.map(r => r.json()))),
// )

// getUsers$.subscribe();
// getUsers$.subscribe();

// // result [[...users], [...posts], [...comments]]


// // fromFetch('https://jsonplaceholder.typicode.com/users').pipe(
// //   mergeMap(res => res.json())
// // ).subscribe(console.log);


// // cold - each subscription - new observable
// // hot - each subscription - one observable

// function fromEvent(element: HTMLElement, event: string) {
//   return new Observable((observer) => {
//     function eventHandler(e: Event) { observer.next(e); }
//     element.addEventListener(event, eventHandler);
//     return () => { element.removeEventListener(event, eventHandler); }
//   });
// }

// const input = document.querySelector('#search input') as HTMLElement;
// const sub2 = fromEvent(input, 'input').pipe(
//   map((e: any) => {
//     return (e.target as HTMLInputElement).value as string
//   }),
//   switchMap((search) =>
//     fromFetch('https://jsonplaceholder.typicode.com/users' +
//       (search ? `?username_like=${search}` : ''))
//   ),
//   mergeMap(res => res.json())
// ).subscribe(console.log);


// function createState(state) {
//   let _observer;
//   const p = new Proxy(state, {
//     set(target, prop, value, receiver) {
//       const result = Reflect.set(target, prop, value, receiver);
//       _observer.next(result);
//       return result;
//     }
//   });
//   return {
//     state$: new Observable((observer) => {
//       _observer = observer;
//     }),
//     state: p
//   };
// }

// const [even$, odd$] = partition(interval(1000), (v) => v % 2 === 0)

// even$.subscribe(console.log);
// odd$.subscribe(console.warn);

function switchMapp(fn: (value: any) => Observable<any>) {
  return function (observable: Observable<any>) {
    return new Observable(function (observer) {
      let sub: Subscription;
      observable.subscribe({
        next: (value: any) => {
          if (sub) { sub.unsubscribe(); }
          sub = fn(value).subscribe({
            next: (newValue: any) => {
              observer.next(newValue);
            },
            error: (error) => {
              observer.error(error);
            },
            complete: () => {
              observer.complete();
            }
          })
        },
        error: (error) => {
          observer.error(error);
        }
      })
    });
  };
}

// of(1, 2, 3).pipe(
//   switchMapp(v => of(v).pipe(delay(1000)))
// ).subscribe((val: any) => {
//   console.log(val);
// });

// let _observer: Observer<any>;

// const s$ = new Observable((observer) => {
//   _observer = observer;
// });

// s$.subscribe(console.log);

// setTimeout(() => {
//   _observer.next(1);
//   _observer.next(2);
//   _observer.next(3);
// })


const s$ = of(1, 2, 3, 4, asyncScheduler).pipe(
  tap(console.log),
  mergeMap(x => of(x).pipe(delay(x * 1000)))
);
console.log('Hello');

const cs$ = connectable(
  s$, { connector: () => new BehaviorSubject(1) }
);

cs$.subscribe(v => console.log('s1', v));
setTimeout(() => {
  cs$.subscribe((v => console.log('s2', v)));
}, 3000);
cs$.connect();


const state = new BehaviorSubject({});

state.subscribe(console.log);

state.next({ newState: true });

state.subscribe(console.log);


// const s$$ = new Subject();
// const s$ = s$$.asObservable();
// s$.subscribe(val => console.log('Aleks', val));

// s$$.next(1);
// s$$.next(2);
// s$$.next(3);

// setTimeout(() => {
//   s$.subscribe(val => console.log('Iliya', val));
//   s$$.next(5);
//   s$$.next(6);
//   s$$.next(6);
// }, 1000)

// https://jsonplaceholder.typicode.com
// /users?username_like=

// 1. listen for input and load users
fromEvent(input, 'input').pipe(
  startWith(''),
  switchMap(() => withFetch())
).subscribe()



// let isLoading = false
// of(1, 2, 3, 4).pipe(
//   tap((value) => {
//     isLoading = true;
//     return 1000;
//   })
// ).subscribe(() => {
//   isLoading = false;
// });