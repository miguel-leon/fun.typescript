import { Pipe } from './typings';


export class Halt implements Pipe<unknown, unknown[], unknown[][]> {
	guard(): any {
		return this;
	}

	try(): any {
		return this;
	}

	catch(): any {
		return this;
	}

	continue(): Pipe<unknown, unknown[], unknown[][]> {
		return this;
	}
}
