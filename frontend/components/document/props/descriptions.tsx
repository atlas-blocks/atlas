import React from 'react';
import {
	MatrixFilterNode,
	ExpressionNode,
	TextNode,
	FileNode,
} from '../../../src/utils/AtlasGraph';

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
			You can use any expression or formula that Julia language supports.{'\n'}
			See more information on expressions in Julia Docs:{'\n'}
			https://docs.julialang.org\n/en/v1/base/math/
		</>
	),
	[TextNode.uitype]: <>Text{'\n\n'}Load any text, like CSV</>,
	[FileNode.uitype]: <>File{'\n\n'}Upload a file</>,
};
