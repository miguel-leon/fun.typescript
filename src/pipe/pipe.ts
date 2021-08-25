import { ClearPipe } from './typings';

import { Success } from './success';


export function pipe(): ClearPipe<void>;
export function pipe<T>(data: T): ClearPipe<T>;
export function pipe(data?: unknown): ClearPipe<any> {
	return new Success(data);
}
