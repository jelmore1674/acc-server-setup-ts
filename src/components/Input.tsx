import React from 'react';

type Props = {
	type: string;
	name: string;
	valueName?: string | number;
	label: string;
	handledChange: any;
	min?: number;
	max?: number;
	isChecked?: any;
	refs?: any;
};

export default function Input({
	type,
	name,
	valueName,
	label,
	handledChange,
	min,
	max,
	isChecked,
	refs,
}: Props) {
	return (
		<div
			className={
				(name !== 'password' && type === 'text') ||
				(type === 'checkbox' && valueName === 'mandatoryPit')
					? 'col-2 p-3 form-group'
					: 'col p-3 form-group'
			}
			ref={refs}>
			<label className='m-2' htmlFor={name}>
				{label}
			</label>
			<input
				className='text-center'
				type={type}
				name={name}
				id={name}
				value={valueName}
				onChange={handledChange}
				min={min}
				max={max}
				checked={isChecked}
			/>
		</div>
	);
}
