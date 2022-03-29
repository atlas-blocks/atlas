import type { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import * as cp from 'child_process';

type Request = {
	latex: string;
};

type ServerResponse = {
	out: string;
	error: string;
	success: string;
};

type Response = {
	latex: string;
};

function fromBase64(str: string): string {
	return Buffer.from(str, 'base64').toString('ascii');
}

async function fetchAsync(url: RequestInfo) {
	let response = await fetch(url);
	return await response.json();
}

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
		return fetchAsync(
			'http://18.219.169.98/cgi-bin/el_simplify.py?in_latex=' +
				fromBase64(req.query.latex.toString()),
		)
			.then((data: ServerResponse) => {
				console.log(data);
				resolve(data);
			})
			.catch((data) => reject(data));
	});

	return runPy.then(onResolve, onReject);
}
