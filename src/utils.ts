import { Observable, switchMap } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { apiUrl$ } from "./constants";

function concatUrl(url: string, path: string) {
  if (url.endsWith('/')) {
    if (path.startsWith('/')) { path = path.slice(1); }
    return url + path;
  }
  if (path.startsWith('/')) { return url + path; }
  return url + '/' + path;
}

function concatQuery(url: string, query?: URLSearchParams) {
  const queryString = query?.toString();
  return queryString ? url + '?' + queryString : url;
}

export function apiFactory<T = any>(path: string, query?: URLSearchParams) {
  const fetchFactory = (apiUrl: string) => fromFetch(concatQuery(concatUrl(apiUrl, path), query));

  return apiUrl$.pipe(
    switchMap(fetchFactory),
    switchMap(response => response.json())
  ) as Observable<T>;
}
