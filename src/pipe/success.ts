import { Pipe, Task } from './typings';
import { Failure } from './failure';


export class Success implements Pipe<unknown, unknown[], unknown[][]> {
	constructor(private data: unknown) {}

	guard(): any {
		return this;
	}

	try(task: Task<unknown, unknown>): any {
		try {
			const next = task(this.data);
			return next == undefined ? this : new Success(next);
		} catch (error) {
			return new Failure(error, this.data);
		}
	}

	catch(): any {
		return this;
	}

	do(task: Task<unknown, unknown>): any {
		const next = task(this.data);
		return next == undefined ? this : new Success(next);
	}
}
