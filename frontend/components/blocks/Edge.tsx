import React from 'react';
import { ArrowHeadType, getBezierPath, getMarkerEnd } from 'react-flow-renderer';
import { Position } from 'react-flow-renderer/dist/types';

export const edgeTypes = {
	DefaultEdge: DefaultEdge,
};

interface DefaultEdgeProps {
	id: string;
	sourceX: number;
	sourceY: number;
	targetX: number;
	targetY: number;
	sourcePosition?: Position;
	targetPosition?: Position;
	style?: object;
	centerX?: number;
	centerY?: number;
	data: { label?: string };
	arrowHeadType: ArrowHeadType;
	markerEndId: string;
}

export function DefaultEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	data = {},
	arrowHeadType = ArrowHeadType.Arrow,
	markerEndId,
}: DefaultEdgeProps) {
	const edgePath = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});
	const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

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
