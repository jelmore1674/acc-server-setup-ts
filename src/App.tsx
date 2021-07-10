import React from 'react';
import { useState } from 'react';
import Sessions from './Sessions';
import './App.css';

export interface SessionObj {
	hourOfDay: number;
	dayOfWeekend: number;
	timeMulitplier: number;
	sessionType: string;
	sessionDuration: number;
}
export interface Event {
	track: string;
	preRaceWaitingTimeSeconds: number;
	sessionOverTimeSeconds: number;
	ambientTemp: number;
	cloudLevel: number;
	rain: number;
	weatherRandomness: number;
	configVersion: number;
	sessions: SessionObj[];
}

const defaultSession: SessionObj = {
	hourOfDay: 14,
	sessionType: 'p',
	dayOfWeekend: 1,
	timeMulitplier: 1,
	sessionDuration: 20,
};

const defaultEvent: Event = {
	track: '',
	preRaceWaitingTimeSeconds: 300,
	sessionOverTimeSeconds: 300,
	ambientTemp: 20,
	cloudLevel: 0.1,
	rain: 0,
	weatherRandomness: 0,
	configVersion: 1,
	sessions: [defaultSession],
};

function App() {
	const [displayedSessions, setDisplayedSessions] = useState(<></>);
	const [eventJSON, setEventJSON] = useState(defaultEvent);
	const [sessionsArr, setSessionsArr] = useState<Array<SessionObj>>([
		defaultSession,
	]);
	const [rows, setRows] = useState(1);

	function handleSelectTrack(
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
	): void {
		if (event.target.id === 'cloudLevel') {
			let cloudLevelRounded = parseInt(event.target.value) / 10;
			setEventJSON({
				...eventJSON,
				[event.target.id]: cloudLevelRounded,
			});
		} else if (event.target.id === 'rain') {
			let rainRounded = parseInt(event.target.value) / 10;
			setEventJSON({
				...eventJSON,
				[event.target.id]: rainRounded,
			});
		} else {
			setEventJSON({
				...eventJSON,
				[event.target.id]: event.target.value,
			});
		}
		console.log(eventJSON);
	}

	return (
		<div className='App'>
			<h1>ACC Server Setup Tool</h1>
			<div>
				<div>
					<label> Select Track </label>
					<select
						name='track'
						id='track'
						onChange={(e) => handleSelectTrack(e)}>
						<option value='spa'> Spa </option>
						<option value='misano'> Misano </option>
					</select>
				</div>
				<div>
					<h2>Set up the weather</h2>
					<div>
						<label>Temp</label>
						<input
							onChange={(e) => handleSelectTrack(e)}
							type='number'
							id='ambientTemp'
							min='15'
							max='42'
						/>
					</div>
					<div>
						<label>Clouds</label>
						<input
							onChange={(e) => handleSelectTrack(e)}
							type='number'
							id='cloudLevel'
							min='0'
							max='10'
						/>
					</div>
					<div>
						<label>Rain</label>
						<input
							onChange={(e) => handleSelectTrack(e)}
							type='number'
							name='rain'
							id='rain'
							min='0'
							max='10'
						/>
					</div>
				</div>
				{/* {displayedSessions} */}
				{sessionsArr.map((session, index) => {
					const {
						sessionType,
						hourOfDay,
						dayOfWeekend,
						timeMulitplier,
						sessionDuration,
					} = sessionsArr[index];
					return (
						<Sessions
							id={index}
							key={index}
							defaultSessionType={sessionType}
							defaultHourOfDay={hourOfDay}
							defaultDayOfWeekend={dayOfWeekend}
							defaultTimeMultiplier={timeMulitplier}
							defaultSessionDuration={sessionDuration}
							sessionsArr={sessionsArr}
							setSessionsArr={setSessionsArr}
							eventJSON={eventJSON}
							setEventJSON={setEventJSON}
							rows={rows}
							setRows={setRows}
						/>
					);
				})}
				<button
					onClick={() => {
						setSessionsArr((prev) => [...prev, defaultSession]);
						console.log(sessionsArr);
						setEventJSON({ ...eventJSON, sessions: sessionsArr });
						// setRows(rows + 1);
					}}>
					Click to add
				</button>
				<button
					onClick={() => {
						console.log(sessionsArr);
					}}>
					Log SessionARR
				</button>
			</div>
			<div>
				<pre>
					<code>{JSON.stringify(eventJSON, null, 2)}</code>
				</pre>
			</div>
		</div>
	);
}

export default App;
