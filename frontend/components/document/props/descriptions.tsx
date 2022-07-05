import { MatrixFilterNode, ExpressionNode, TextNode, FileNode } from '../../../utils/AtlasGraph';

('../../utils/AtlasGraph');

export const typeDescriptions = {
	[MatrixFilterNode.uitype]: (
		<>
			Matrix Filter{'\n\n'}
			You can choose Matrix and add a special filter to any Columns and/or Rows with the logic
			Operator and Value:{'\n'}
			matrix: A col: 1, opr: &lt, val: 4{'\n'}
			-- provides all rows of matrix A with values less than 4 in Column 1{'\n'}
			row: 2, opr: &gt, val: 0{'\n'}
			-- provides all columns of matrix A with values more than 0 in Row
		</>
	),
	[ExpressionNode.uitype]: (
		<>
			Expression{'\n\n'}
			You can use an expression, formula, operator which Julia language supports.{'\n\n'}
			See more information about expressions in ATLAS documentation:{'\n'}
			<a target={'_blank'} href={'https://docs.ca.engineering'}>
				docs.ca.engineering
			</a>
		</>
	),
	[TextNode.uitype]: <>Text{'\n\n'}Load any text, like CSV</>,
	[FileNode.uitype]: <>File{'\n\n'}Upload a file</>,
};
