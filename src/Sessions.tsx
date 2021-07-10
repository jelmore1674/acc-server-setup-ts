import React from 'react';
import { Event, SessionObj } from './App';

type Props = {
	sessionsArr: SessionObj[];
	setSessionsArr: (sessions: Array<SessionObj>) => void;
	eventJSON: Event;
	setEventJSON: (state: Event) => void;
	id: number;
	rows: number;
	setRows: (rows: number) => void;
	defaultSessionType: string;
	defaultHourOfDay: number;
	defaultDayOfWeekend: number;
	defaultTimeMultiplier: number;
	defaultSessionDuration: number;
};

export default function Sessions({
	sessionsArr,
	setSessionsArr,
	eventJSON,
	setEventJSON,
	id,
	rows,
	setRows,
	defaultSessionDuration,
	defaultHourOfDay,
	defaultDayOfWeekend,
	defaultTimeMultiplier,
	defaultSessionType,
}: Props) {
	const [addedToArray, setAdded] = React.useState(false); // Should only be changed once on initial load of Sessions element
	const [sessionType, setSessionType] = React.useState(defaultSessionType); // set initial values inside useState(*Initial value*)
	const [dayOfWeekend, setDayOfWeekend] = React.useState(defaultDayOfWeekend);
	const [timeMulitplier, setTimeMulitplier] = React.useState(
		defaultTimeMultiplier
	);
	const [sessionDuration, setSessionDuration] = React.useState(
		defaultSessionDuration
	);
	const [hourOfDay, setHourOfDay] = React.useState(defaultHourOfDay);

	// In the useEffect if (added) > update object, else > add to sessionArr
	// Add an object with an initial starting state to sessionsArr
	// setAdded(true)

	let selectedSession: SessionObj = {
		hourOfDay: hourOfDay,
		sessionType: sessionType,
		dayOfWeekend: dayOfWeekend,
		timeMulitplier: timeMulitplier,
		sessionDuration: sessionDuration,
	};

	React.useEffect(() => {
		if (addedToArray) {
			// Overwrite existing element in sessionArr
			let selectedSession: SessionObj = {
				hourOfDay: hourOfDay,
				sessionType: sessionType,
				dayOfWeekend: dayOfWeekend,
				timeMulitplier: timeMulitplier,
				sessionDuration: sessionDuration,
			};
			sessionsArr[id] = selectedSession;
			setEventJSON({ ...eventJSON, sessions: sessionsArr });
		} else {
			setEventJSON({ ...eventJSON, sessions: sessionsArr });
			setAdded(true);
		}
	}, [sessionType, hourOfDay, dayOfWeekend, timeMulitplier, sessionDuration]); // Add all form variables that require the object to be updated in this second parameter

	function handleClick() {
		setRows(rows - 1);
		sessionsArr.splice(id, 1);
		setSessionsArr(sessionsArr);
		console.log(sessionsArr);
		// setEventJSON({ ...eventJSON, sessions: sessionsArr });
	}

	return (
		<div>
			<h1>{id}</h1>
			<h2>Sessions</h2>
			<div>
				<label>Session Type</label>
				<select
					onChange={(e) => setSessionType(e.target.value)}
					name='sessionType'
					id='sessionType'
					value={sessionsArr[id].sessionType}>
					<option value='p'>practice</option>
					<option value='q'>quali</option>
					<option value='r'>race</option>
				</select>
				<div>
					<label>Session Day</label>
					<select
						onChange={(e) => {
							let parsedDate = parseInt(e.target.value);
							setDayOfWeekend(parsedDate);
						}} // Change all of these onChange functions to set the relative states
						name='dayOfWeekend'
						id='dayOfWeekend'
						value={sessionsArr[id].dayOfWeekend}>
						<option value='1'>Friday</option>
						<option value='2'>Saturday</option>
						<option value='3'>Sunday</option>
					</select>
				</div>
				<div>
					<label>Session Start Time in Sim</label>
					<input
						onChange={(e) => {
							setHourOfDay(parseInt(e.target.value));
						}}
						value={hourOfDay}
						type='number'
						id='hourOfDay'
						min='0'
						max='23'
					/>
				</div>
				<div>
					<label>Session Duration</label>
					<input
						onChange={(e) =>
							setSessionDuration(parseInt(e.target.value))
						}
						type='number'
						id='sessionDuration'
						min='0'
						max='640'
						value={sessionDuration}
					/>
				</div>
				<div>
					<label>Time Mulitplier</label>
					<input
						onChange={(e) =>
							setTimeMulitplier(parseInt(e.target.value))
						}
						type='number'
						id='timeMulitplier'
						min='1'
						max='60'
						value={timeMulitplier}
					/>
				</div>
				<button onClick={handleClick}>Click to remove</button>
				<button onClick={() => console.log(sessionsArr)}>
					Log Array
				</button>
				<button onClick={() => console.log(eventJSON)}>
					EVENT JSON
				</button>
				<div>{JSON.stringify(eventJSON.sessions[id])}</div>
			</div>
		</div>
	);
}
