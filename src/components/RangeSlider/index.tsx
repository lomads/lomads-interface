import React, { useEffect, useState } from "react"
import { Range } from 'react-range';
// @ts-ignore
import chroma from 'chroma-js';

const colors = ["#FFCC18", "#A7DB39", "#1AC1C1"];

export function getTrackBackground({
	values,
}: any) {
	// sort values ascending
	const progress = values.slice(0).sort((a: any, b: any) => a - b).map((value: any) => ((value - 0) / 100) * 100);
	console.log(progress)
	const middle = progress.reduce(
		(acc: any, point: any, index: number) =>
			`${acc}, ${colors[index]} ${point}%, ${colors[index + 1]} ${point}%`,
		''
	);
	console.log(middle)
	console.log(`linear-gradient(45deg, ${colors[0]} 0%${middle}, ${colors[colors.length - 1]
		} 100%)`)
	return `linear-gradient(45deg, ${colors[0]} 0%${middle}, ${colors[colors.length - 1]
		} 100%)`;
}


export default ({ defaultValue, showThumb, disabled, onChange, ...props }: any) => {
	const [value, setValue] = useState(0)
	const [thumbBg, setThumbBg] = useState(colors[0])

	// const getThumbBackground = () => {
	//     console.log(value % 11)
	// }

	useEffect(() => {
		const f = chroma.scale(colors);
		let color = f(value / 100).toString()
		setThumbBg(color)
		onChange({ value, color })
	}, [value])

	useEffect(() => {
		if (defaultValue)
			setValue(defaultValue)
	}, [defaultValue])

	return (
		<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
			<div style={{
				backgroundColor: '#FFCD18',
				height: '15px',
				width: 80 / 2,
				borderRadius: '8px 0 0 8px',
				alignSelf: 'center'
			}}></div>
			<Range
				disabled={disabled}
				step={1}
				min={0}
				max={100}
				values={[value]}
				onChange={(values) => setValue(values[0])}
				renderTrack={({ props, children }) => (
					<div
						onMouseDown={props.onMouseDown}
						onTouchStart={props.onTouchStart}
						style={{
							...props.style,
							height: '36px',
							display: 'flex',
							width: '100%',
							position: 'relative',
						}}
					>
						<div style={{
							position: 'absolute',
							backgroundColor: '#F5F5F5',
							height: '15px',
							right: 0,
							width: `${100 - value}%`,
							alignSelf: 'center'
						}} ></div>
						<div
							ref={props.ref}
							style={{
								height: '15px',
								width: '100%',
								alignSelf: 'center',
								background: `linear-gradient(90deg,
                             #FFCD18 0%,
                             #8ecc3e 50%,
                             #1AC1C1 100%
                        )
                        `
							}}
						>
							{children}
						</div>
					</div>
				)}
				renderThumb={({ props, isDragged }) => (
					<div
						{...props}
						style={{
							...props.style,
							backgroundColor: thumbBg,
							height: showThumb ? '40px' : '0px',
							width: showThumb ? '59px' : '0px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							boxShadow: '0px 2px 6px #AAA',
							borderRadius: 8,
						}}
					>
						<div
							style={{
								height: '16px',
								margin: '0 4px',
								width: '2px',
								backgroundColor: chroma(thumbBg).darken(1).toString()
							}}
						/>
						<div
							style={{
								height: '16px',
								margin: '0 4px',
								width: '2px',
								backgroundColor: chroma(thumbBg).darken(1).toString()
							}}
						/>
						<div
							style={{
								height: '16px',
								margin: '0 4px',
								width: '2px',
								backgroundColor: chroma(thumbBg).darken(1).toString()
							}}
						/>
					</div>
				)}
			/>
			<div style={{
				backgroundColor: '#F5F5F5',
				height: '15px',
				width: 80 / 2,
				borderRadius: '0 8px 8px 0',
				alignSelf: 'center'
			}}></div>
		</div>
	)
}