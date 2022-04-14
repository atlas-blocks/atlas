import type { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
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
		res.status(StatusCodes.OK).json({ ...data, latex: data.out });
		console.log('server >> client: ', data);
	};
	const onReject = (data: ServerResponse) => {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(ReasonPhrases.INTERNAL_SERVER_ERROR);
		console.log('server >> client: ', data);
	};

	const runPy = new Promise<ServerResponse>(function (resolve, reject) {
		console.log(req.query.latex);
		return ServerUtils.get('http://18.219.169.98/cgi-bin/el_simplify.py', {
			in_latex: req.query.latex.toString(),
		})
			.then((data: ServerResponse) => {
				resolve(data);
			})
			.catch((data) => reject(data));
	});

	return runPy.then(onResolve, onReject);
}
