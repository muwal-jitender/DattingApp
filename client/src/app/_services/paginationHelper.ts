import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../_models/pagination';



const getPaginatedResult = <T>(url: string, params: HttpParams, http: HttpClient) => {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();

    return http.get<T>(url, { observe: 'response', params }).pipe(
        map(response => {
            paginatedResult.result = response.body;
            const paginationHeader = response.headers.get('Pagination');
            if (paginationHeader !== null) {
                paginatedResult.pagination = JSON.parse(paginationHeader);
            }
            return paginatedResult;
        })
    );
};

const getPaginationHeaders = (pageNumber: number, pageSize: number) => {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
};

export { getPaginatedResult, getPaginationHeaders };
