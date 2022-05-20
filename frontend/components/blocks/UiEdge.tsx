import React from 'react';
import { getBezierPath, getMarkerEnd, MarkerType, EdgeProps } from 'react-flow-renderer';

export const uiEdgeTypes = {
	DefaultEdge: DefaultEdge,
};

export default function DefaultEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data = {},
	markerEnd = '',
}: EdgeProps) {
	const edgePath = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	return (
		<>
			<path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
			<text>
				<textPath
					href={`#${id}`}
					style={{ fontSize: '12px' }}
					startOffset="50%"
					textAnchor="middle"
				>
					{data.label}
				</textPath>
			</text>
		</>
	);
}
