import React from 'react';

import FileNode from '../src/graph/nodes/FileNode';
import MatrixFilterNode from '../src/graph/nodes/MatrixFilterNode';
import TextNode from '../src/graph/nodes/TextNode';
import ExpressionNode from '../src/graph/nodes/ExpressionNode';
import DesmosNode from '../src/graph/nodes/DesmosNode';

export const panels = {
	mockup: 'Mockup',
	elements: 'Elements',
};

export const nodeDescriptions = {
	[MatrixFilterNode.ui_type]: (
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
	[ExpressionNode.ui_type]: (
		<>
			Expression{'\n\n'}
			You can use any expression, formula, operator which Julia language supports.{'\n\n'}
			See more information about expressions in ATLAS documentation:{'\n'}
			<a target={'_blank'} href={'https://docs.ca.engineering'} rel="noreferrer">
				docs.ca.engineering
			</a>
		</>
	),
	[TextNode.ui_type]: (
		<>
			Text{'\n\n'}You can add any text like string, CSV, JSON. Output of TextNode is a String
			type.
		</>
	),
	[FileNode.ui_type]: <>File{'\n\n'}Upload a file</>,
	[DesmosNode.ui_type]: <>Desmos{'\n\n'}Double click on the block to open tab with a grpah</>,
};
