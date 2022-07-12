import { AtlasNode, ExpressionNode, TextNode } from '../../src/utils/AtlasGraph';

export const exampleNodes: AtlasNode[] = [
	ExpressionNode.build()
		.setResult('-0.9589')
		.setContent('sin(5)')
		.setPosition(100, 100)
		.setName('ex1'),
	ExpressionNode.build()
		.setResult('[-1, -2, -3]')
		.setContent('[-1, -2, -3]')
		.setPosition(100, 300)
		.setName('ex2'),
	TextNode.build().setContent('1,2,3\n4,5,6').setPosition(300, 300).setName('ex3'),
	ExpressionNode.build()
		.setResult('[[1, 4], [2, 5], [3, 6]]')
		.setContent('Math.csv2vector(ex3)')
		.setPosition(500, 300)
		.setName('ex4'),
	ExpressionNode.build()
		.setResult('-1.9178')
		.setContent('Math.ifthenelse(2 == 3, asin(ex1), ex1 * 2)')
		.setPosition(350, 150)
		.setName('ex5'),
];
