import type { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import * as cp from 'child_process';

type Request = {
	latex: string;
};

type Response = {
	latex: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	const onResolve = (data: string): void => {
		console.log(data.toString());
		res.status(StatusCodes.OK).json(JSON.parse(data.toString()));
	};
	const onReject = (data: string) => {
		console.log(data.toString());
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(ReasonPhrases.INTERNAL_SERVER_ERROR);
	};

	const runPy = new Promise<string>(function (resolve, reject) {
		const childProcess = cp.spawn('python3', [
			'./backend/simplify.py',
			'--latex=' + req.query.latex.toString(),
		]);

		childProcess.stdout.on('data', (data) => resolve(data));
		childProcess.stderr.on('data', (data) => reject(data));
	});

	return runPy.then(onResolve, onReject);
}
