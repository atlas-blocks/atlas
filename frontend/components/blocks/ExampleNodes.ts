import {AtlasNode, ExpressionNode, TextNode} from "../../utils/AtlasGraph";

export const exampleNodes = [
    new ExpressionNode(
        new AtlasNode('AtlasGraph.ExpressionNode', 'ex1', 'pkg', [300, 100], true),
        'sin(5)',
        '-0.9589',
    ),
    new ExpressionNode(
        new AtlasNode('AtlasGraph.ExpressionNode', 'ex2', 'pkg', [200, 200], true),
        'ifthenelse(2 == 3, asin(ex1), ex1 * 2)',
        '-1.9178',
    ),
    new ExpressionNode(
        new AtlasNode('AtlasGraph.ExpressionNode', 'ex3', 'pkg', [100, 300], true),
        '[-1, -2, -3]',
        '[-1, -2, -3]',
    ),
    new TextNode(
        new AtlasNode('AtlasGraph.TextNode', 'ex4', 'pkg', [300, 300], true),
        '1,2,3\n4,5,6',
    ),
    new ExpressionNode(
        new AtlasNode('AtlasGraph.ExpressionNode', 'ex5', 'pkg', [500, 300], true),
        'csv2vector(ex4)',
        '[[1, 4], [2, 5], [3, 6]]',
    ),
];
