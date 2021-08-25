import { ContinueTask, Pipe, Task } from './typings';
import { Failure } from './failure';


export class Success implements Pipe<unknown, unknown[], unknown[][]> {
	constructor(private data: unknown) {}

	guard(): any {
		return this;
	}

	try(task: Task<unknown, unknown>): any {
		try {
			return new Success(task(this.data));
		} catch (error) {
			return new Failure(error, this.data);
		}
	}

	catch(): any {
		return this;
	}

	continue(task: ContinueTask<unknown>): Pipe<unknown, unknown[], unknown[][]> {
		task(this.data);
		return this;
	}
}
