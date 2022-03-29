import type { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import * as cp from 'child_process';
import ServerUtils from '../../utils/ServerUtils';

type ServerResponse = {
	out: string;
	error: string;
	success: string;
};

type Response = {
	latex: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	const onResolve = (data: ServerResponse): void => {
		console.log(data);
		res.status(StatusCodes.OK).json({ ...data, latex: data.out });
	};
	const onReject = (data: ServerResponse) => {
		console.log(data);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(ReasonPhrases.INTERNAL_SERVER_ERROR);
	};

	const runPy = new Promise<ServerResponse>(function (resolve, reject) {
		console.log(req.query.latex);
		return ServerUtils.get('http://18.219.169.98/cgi-bin/el_simplify.py', {
			in_latex: req.query.latex.toString(),
		})
			.then((data: ServerResponse) => {
				console.log(data);
				resolve(data);
			})
			.catch((data) => reject(data));
	});

	return runPy.then(onResolve, onReject);
}
