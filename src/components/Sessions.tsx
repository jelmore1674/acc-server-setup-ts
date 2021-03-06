import React from 'react';
import { Event, SessionObj } from '../Routes/Event/event';
import { Tooltip } from '../assets/bootstrap-5.0.2-dist/js/bootstrap.esm';

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
	const rowRef = React.useRef(rows);
	rowRef.current = rows;
	const tooltipDay: any = React.useRef();
	const tooltipType: any = React.useRef();
	const tooltipTime: any = React.useRef();
	const tooltipDuration: any = React.useRef();
	const tooltipTimeMultiplier: any = React.useRef();

	React.useEffect(() => {
		var tooltip = new Tooltip(tooltipDay.current, {
			title: 'Select the day for the session.',
			placement: 'top',
			trigger: 'hover',
		});
		tooltip = new Tooltip(tooltipType.current, {
			title: 'Select the type of session. If including a race, be sure to have either a practice or quali session before the race.',
			placement: 'top',
			trigger: 'hover',
		});
		tooltip = new Tooltip(tooltipTime.current, {
			title: 'Set the time of the current session.',
			placement: 'top',
			trigger: 'hover',
		});
		tooltip = new Tooltip(tooltipDuration.current, {
			title: 'Set the duration of the current session.',
			placement: 'top',
			trigger: 'hover',
		});
		tooltip = new Tooltip(tooltipTimeMultiplier.current, {
			title: 'Set the time multiplier of the current session.',
			placement: 'top',
			trigger: 'hover',
		});
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
		for (let i = 0; i < sessionsArr.length; i++) {
			if (i === id) {
				setRows(rowRef.current - 1);
				sessionsArr.splice(id, 1);
				setSessionsArr(sessionsArr);
			}
		}

		// setOpacity('');
	}

	return (
		<div className={'bg-secondary rounded mb-3 p-3'}>
			<div className='row align-content-center '>
				<div className='col'>
					<h2>Session {id + 1}</h2>
					<div className='row '>
						<div
							ref={tooltipType}
							className='col-2 d-flex flex-column justify-content-between mb-3'>
							<label>Session Type</label>
							<select
								onChange={(e) => setSessionType(e.target.value)}
								name='sessionType'
								id='sessionType'
								value={sessionsArr[id].sessionType}>
								<option value='p'>Practice</option>
								<option value='q'>Quali</option>
								<option value='r'>Race</option>
							</select>
						</div>
						<div
							ref={tooltipDay}
							className='col-2 d-flex flex-column justify-content-between mb-3'>
							<label>Session Day</label>
							<select
								onChange={(e) => {
									let parsedDate = parseInt(e.target.value);
									setDayOfWeekend(parsedDate);
								}}
								name='dayOfWeekend'
								id='dayOfWeekend'
								value={sessionsArr[id].dayOfWeekend}>
								<option value='1'>Friday</option>
								<option value='2'>Saturday</option>
								<option value='3'>Sunday</option>
							</select>
						</div>
						<div
							ref={tooltipTime}
							className='col-2 d-flex flex-column justify-content-between mb-3'>
							<label>Session Start Time in Sim</label>
							<input
								onChange={(e) => {
									setHourOfDay(parseInt(e.target.value));
								}}
								value={sessionsArr[id].hourOfDay}
								type='number'
								id='hourOfDay'
								min='0'
								max='23'
							/>
						</div>
						<div
							ref={tooltipDuration}
							className='col-2 d-flex flex-column justify-content-between mb-3'>
							<label>Session Duration</label>
							<input
								onChange={(e) =>
									setSessionDuration(parseInt(e.target.value))
								}
								type='number'
								id='sessionDuration'
								min='0'
								max='640'
								value={sessionsArr[id].sessionDuration}
							/>
						</div>
						<div
							ref={tooltipTimeMultiplier}
							className='col-2 d-flex flex-column justify-content-between mb-3'>
							<label>Time Mulitplier</label>
							<input
								onChange={(e) =>
									setTimeMulitplier(parseInt(e.target.value))
								}
								type='number'
								id='timeMulitplier'
								min='1'
								max='60'
								value={sessionsArr[id].timeMulitplier}
							/>
						</div>
						<div className='col-2 d-flex flex-column justify-content-around mb-3'>
							<button
								className='btn btn-lg bg-danger p-3'
								onClick={handleClick}>
								<i
									className='bi bi-trash fs-2'
									style={{
										color: 'white',
									}}></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
