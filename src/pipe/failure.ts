import { CatchTask, Pipe } from './typings';
import { Success } from './success';
import { Halt } from './halt';


export class Failure implements Pipe<unknown, unknown[], unknown[][]> {
	constructor(private error: unknown, private data: unknown, private level = 0) {}

	guard(): any {
		return new Failure(this.error, this.data, this.level + 1);
	}

	try(): any {
		return this;
	}

	catch(task: CatchTask<unknown, unknown, unknown>, level?: number): any {
		if (level === undefined || level >= this.level) {
			const r = task(this.error, this.data);
			return r === undefined ?
				new Halt() :
				new Success(r);
		} else {
			return new Failure(this.error, this.data, this.level - level - 1);
		}
	}

	do(): Pipe<unknown, unknown[], unknown[][]> {
		return this;
	}
}
