import type { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ServerUtils from '../../utils/ServerUtils';

export default function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
	const onResolve = (data: any): void => {
		res.status(StatusCodes.OK).json(data);
		console.log('server >> client: ', data);
	};
	const onReject = (data: any) => {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(ReasonPhrases.INTERNAL_SERVER_ERROR);
		console.log('server >> client: ', data);
	};

	const runPy = new Promise<any>(function (resolve, reject) {
		console.log(req.query.url.toString());
		const url = req.query.url.toString();
		const request = JSON.parse(req.query.request.toString());
		console.log('request: ', JSON.stringify(request));
		return ServerUtils.get(url, request)
			.then((data: any) => {
				resolve(data);
			})
			.catch((data) => reject(data));
	});

	return runPy.then(onResolve, onReject);
}
