import { debounceTime, partition, filter, fromEvent, map, startWith, switchMap, tap, scan, skipUntil, takeUntil, combineLatest, shareReplay, publish, connectable, merge, BehaviorSubject, ReplaySubject, withLatestFrom, skipWhile, of, delay, interval, take, bufferWhen, skip, mergeMap, concatAll, mergeAll, exhaustAll, buffer, zip, zipAll, zipWith, from, reduce } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { loadPosts, loadUsers } from './api.service';
import { IPost, IUser } from './interfaces';


// ? ! Create a stream which emits whenever the the command/ctrl key has been pressed
const cmdPress$ = of();
// const cmdPress$ = fromEvent(document, 'keydown').pipe(
//   filter((e: KeyboardEvent) => e.key === 'Meta')
// );


// ? ! Create a stream which emits whenever the the command/ctrl key has been released
const cmdRelease$ = of();
// const cmdRelease$ = fromEvent(document, 'keyup').pipe(
//   filter((e: KeyboardEvent) => e.key === 'Meta')
// );


// ! Create a stream which tracks the "pressed" state of the command/ctrl key
const cmdPressed$ = of();
// * Example: cmdPressed$.subscribe(console.log) => This should emit `true` when the command/ctrl key has been pressed and `false` whenever it is released
// const cmdPressed$ = merge(
//   cmdPress$.pipe(map(() => true)),
//   cmdRelease$.pipe(map(() => false))
// );


// ! Create a multicast observable for the previous stream (https://rxjs.dev/api/index/function/connectable) and initiate it
const connectableCmdPressed$ = of();
// const connectableCmdPressed$ = connectable(
//   cmdPressed$,
//   { connector: () => new BehaviorSubject(false) }
// );
// connectableCmdPressed$.connect();


// ! Create a class Search which has the following members:
// !     - input: a reference to the the input element on the page
// !
// !     - input$: a stream which emits whenever something has been typed into said input element
// * Example: (new Search()).input$.subscribe(console.log); => This should log everything typed into the text input on the page
class Search {
  input = document.querySelector('#search input') as HTMLInputElement;
  input$ = of();
}
// class Search {
//   input = document.querySelector('#search input') as HTMLInputElement;
//   input$ = fromEvent(this.input, 'input');
// }


// ! Create a class UserList which has the following members:
// !     - container: a reference to the user list container on the page
// !     - loader: a reference to the user list loader
// !     - ul: a reference to the the user list ul element;
// !
// !     - showLoading: a method for showing the loader
// !     - hideLoading: a method for hiding the loader
// !     - renderUsers: a method which when passed an array of users, renders them as list elements in the ul
// !     - listItemClicked$: a stream which tracks whenever a li element has been clicked and emits the element itself
class UserList {
  container = document.getElementById('user-list-container') as HTMLDivElement;
  loader = document.querySelector('#user-list-container .loader') as HTMLDivElement;
  ul = document.querySelector('#user-list-container ul') as HTMLUListElement;

  showLoading(): void {
    if (this.container.classList.contains('loading')) { return; }
    this.container.classList.add('loading');
  }

  hideLoading(): void {
    this.container.classList.remove('loading');
  }

  renderUsers(users: any[]): void {
    this.ul.innerHTML = '';
    for (const u of users) {
      const li = document.createElement('li');
      li.setAttribute('data-id', u.id);
      li.innerHTML = `${u.username}`;
      this.ul.appendChild(li);
    }
  }

  listItemClick$ = of();
}
// class UserList {
//   container = document.getElementById('user-list-container') as HTMLDivElement;
//   loader = document.querySelector('#user-list-container .loader') as HTMLDivElement;
//   ul = document.querySelector('#user-list-container ul') as HTMLUListElement;

//   listItemClick$ = fromEvent(this.ul, 'click').pipe(
//     map(event => {
//       if ((event.target as HTMLElement).tagName.toLowerCase() !== 'li') { return null; }
//       return event.target;
//     }),
//     filter(val => val !== null)
//   );

//   showLoading(): void {
//     if (this.container.classList.contains('loading')) { return; }
//     this.container.classList.add('loading');
//   }

//   hideLoading(): void {
//     this.container.classList.remove('loading');
//   }

//   // effect
//   // fetchAndRenderUsers(query?: URLSearchParams): void {
//   //   this.container.classList.add('loading')
//   //   loadUsers(query).subscribe(users => {
//   //     this.container.classList.remove('loading')
//   //     this.renderUsers(users);
//   //   });
//   // }

//   renderUsers(users: any[]): void {
//     this.ul.innerHTML = '';
//     for (const u of users) {
//       const li = document.createElement('li');
//       li.setAttribute('data-id', u.id);
//       li.innerHTML = `${u.username}`;
//       this.ul.appendChild(li);
//     }
//   }
// }

// ! Create a class UserPostsList which has the following members:
// !     - container: a reference to the user post list container on the page
// !     - loader: a reference to the user post list loader
// !     - ul: a reference to the the user post  list ul element;
// !
// !     - showLoading: a method for showing the loader
// !     - hideLoading: a method for hiding the loader
// !     - show: a method for showing the user post list container
// !     - hide: a method for hiding the user post list container
// !     - renderUserPosts: a method which when passed an array of user posts, renders them as list elements in the ul

class UserPostsList {
  container = document.getElementById('user-posts-container') as HTMLDivElement;
  loader = document.querySelector('#user-posts-container .loader') as HTMLDivElement;
  ul = document.querySelector('#user-posts-container ul') as HTMLUListElement;

  showLoading(): void {
    if (this.container.classList.contains('loading')) { return; }
    this.container.classList.add('loading');
  }

  hideLoading(): void {
    this.container.classList.remove('loading');
  }

  show(): void {
    this.container.style.display = 'block';
  }
  hide(): void {
    this.container.style.display = 'none';
  }

  renderUserPosts(posts: any[]): void {
    this.ul.innerHTML = '';
    for (const p of posts) {
      const li = document.createElement('li');
      li.setAttribute('data-id', p.id);
      li.innerHTML = `${p.body}`;
      this.ul.appendChild(li);
    }
  }

}

const userList = new UserList();
const userPostList = new UserPostsList();
const search = new Search();


class Effects {
  init() {
    // ! Connect the search input with input list
    // ! meaning that whenever something is typed into the search, a new request to fetch the users is sent
    // ! PS: this should also handle the initial loading of the users
    search.input$.pipe(
      //...
    ).subscribe(users => {
      userList.hideLoading();
      userList.renderUsers(users);
    });
    // search.input$.pipe(
    //   debounceTime(500),
    //   map(event => (event.target as HTMLInputElement).value),
    //   startWith(''),
    //   tap(() => userList.showLoading()),
    //   switchMap(filter => {
    //     const search = new URLSearchParams();
    //     if (filter) { search.set('username_like', filter); }
    //     return loadUsers(search);
    //   }),
    // ).subscribe(users => {
    //   userList.hideLoading();
    //   userList.renderUsers(users);
    // });


    // ! Create a stream which tracks which user has been selected based on the user list clicks;
    // ! hint: https://rxjs.dev/api/index/function/scan
    const selectedUser$ = of();
    // const selectedUser$ = userList.listItemClick$.pipe(
    //   withLatestFrom(connectableCmdPressed$),
    //   filter(([, isCmdPressed]) => !isCmdPressed),
    //   map(([item]) => item),
    //   scan((prev, current) => {
    //     if (current === prev) { return null; }
    //     return current;
    //   }, null)
    // );


    // ! Split/partition the selectedUser$ into two streams - userDeselected$, userSelected$; which will let us know when a user is selected or deselected
    // ! hint: https://rxjs.dev/api/index/function/partition
    const [userDeselected$, userSelected$] = of() as any;
    // const [userDeselected$, userSelected$] = partition(
    //   selectedUser$.pipe(startWith(null)),
    //   (val) => val === null
    // );


    userDeselected$.subscribe(() => {
      userPostList.hide();
      userPostList.renderUserPosts([]);
    });

    userSelected$.pipe(
      map((listItem: HTMLLIElement) => +listItem.getAttribute('data-id')),
      tap(() => {
        userPostList.show();
        userPostList.showLoading();
      }),
      switchMap((selectedUserId) => {
        const search = new URLSearchParams();
        search.set('userId', selectedUserId.toString());
        return loadPosts(undefined, search);
      })
    ).subscribe((userPosts: IPost[]) => {
      userPostList.hideLoading();
      userPostList.renderUserPosts(userPosts);
    });


    // ! Create a stream which keeps track of all of the users we've clicked on while the command/ctrl button has been pressed
    // * Example selectedCmdPressUsers$.subscribe(console.log) =>
    // *      if the command/ctrl is pressed and we click on 3 users, when we release the key, we should get an array of 3 users
    const selectedCmdPressUsers$ = of();
    // const selectedCmdPressUsers$ = userList.listItemClick$.pipe(
    //   bufferWhen(() => connectableCmdPressed$.pipe(
    //     filter(val => val == false),
    //     skip(1)
    //   ))
    // );


    // ! Create a stream which whenever the `selectedCmdPressUsers$` stream emits, it loads the posts for each user
    // * Example selectedUsersPosts$.subscribe(console.log) =>
    // *      if `selectedCmdPressUsers$` emits an array of 3 users, here we should get an array with a length of 3,
    // *      where each element represents the corresponding users posts
    const selectedUsersPosts$ = selectedCmdPressUsers$.pipe(
      //...
    );
    selectedUsersPosts$.subscribe((postsByUser: any) => {
      const posts = postsByUser.reduce((a: IPost[], c: IPost[]) => [...a, ...c], []);
      userPostList.hideLoading();
      userPostList.renderUserPosts(posts);
    });
    // selectedCmdPressUsers$.pipe(
    //   map(users => users.map((listItem: HTMLLIElement) => +listItem.getAttribute('data-id'))),
    //   mergeMap(ids => {
    //     return zip(ids.map(id => {
    //       const search = new URLSearchParams();
    //       search.set('userId', id.toString());
    //       return loadPosts(undefined, search);
    //     }))
    //   }),
    // ).subscribe(postsByUser => {
    //   const posts = postsByUser.reduce((a, c) => [...a,...c], []);
    //   userPostList.hideLoading();
    //   userPostList.renderUserPosts(posts);
    // });
  }
}

const effects = new Effects();
effects.init();
