import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import Sessions from '../../components/Sessions';
import TrackList from './tracks.json';

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
	track: TrackList[0].tracks[0].trackName,
	preRaceWaitingTimeSeconds: 300,
	sessionOverTimeSeconds: 300,
	ambientTemp: 20,
	cloudLevel: 0.1,
	rain: 0,
	weatherRandomness: 0,
	configVersion: 1,
	sessions: [defaultSession],
};

export default function EventRoute() {
	const [year, setYear] = useState(TrackList[0].year);
	const [track, setTrack] = useState(TrackList[0].tracks[0].trackName);
	const [eventJSON, setEventJSON] = useState(defaultEvent);
	const [sessionsArr, setSessionsArr] = useState<Array<SessionObj>>([
		defaultSession,
	]);
	const [rows, setRows] = useState(1);
	const [opacity, setOpacity] = useState('');

	const styles = {
		transition: 'all 2s ease-out',
		opacity: 0.3,
	};

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
		} else if (event.target.id === 'track') {
			setTrack(event.target.value);
			setEventJSON({
				...eventJSON,
				[event.target.id]: event.target.value,
			});
		} else {
			setEventJSON({
				...eventJSON,
				[event.target.id]: event.target.value,
			});
		}
		console.log(eventJSON);
	}

	function handleYearChange(event: ChangeEvent<HTMLSelectElement>): void {
		const selectedYear = parseInt(event.target.value);
		setYear((y) => selectedYear);
		for (let i = 0; i < TrackList.length; i++) {
			if (TrackList[i].year === selectedYear) {
				setTrack(TrackList[i].tracks[0].trackName);
				setEventJSON({
					...eventJSON,
					track: TrackList[i].tracks[0].trackName,
				});
			}
		}
	}

	return (
		<div className='row justify-content-around'>
			<div className='col-10  align-center'>
				<div>
					<h1 className='h1 text-center'>ACC Server Setup Tool</h1>
					<div className='row align-items-start justify-content-evenly'>
						<div className='col-4'>
							<label>Select Year</label>
							<select
								name='year'
								id='year'
								value={year}
								onChange={(e) => handleYearChange(e)}>
								{TrackList.map((year) => {
									return (
										<option
											value={year.year}
											id={`${year.year}`}>
											{year.year}
										</option>
									);
								})}
							</select>
						</div>

						<div className='col-4'>
							<label> Select Track </label>
							<select
								name='track'
								id='track'
								value={track}
								onChange={(e) => handleSelectTrack(e)}>
								{TrackList.map((track) => {
									if (year === track.year) {
										return track.tracks.map(
											(track, index) => {
												return (
													<option
														key={index}
														value={track.trackName}>
														{track.title}
													</option>
												);
											}
										);
									}
								})}
							</select>
						</div>
					</div>
				</div>
				<div className='row my-3'>
					<div className='col text-center'>
						<h2>Set up the weather</h2>
						<div className='row align-center border border-secondary my-3'>
							<div className='col d-flex justify-content-evenly border border-secondary py-3'>
								<label>Temp</label>
								<input
									onChange={(e) => handleSelectTrack(e)}
									type='number'
									id='ambientTemp'
									min='15'
									max='42'
								/>
							</div>
							<div className='col d-flex justify-content-evenly border border-secondary py-3'>
								<label>Clouds</label>
								<input
									onChange={(e) => handleSelectTrack(e)}
									type='number'
									id='cloudLevel'
									min='0'
									max='10'
								/>
							</div>
							<div className='col d-flex justify-content-evenly border border-secondary py-3'>
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
					</div>
				</div>
				{/* {displayedSessions} */}
				<div className='container-fluid '>
					{sessionsArr.map((session, index) => {
						const {
							sessionType,
							hourOfDay,
							dayOfWeekend,
							timeMulitplier,
							sessionDuration,
						} = sessionsArr[index];
						return (
							<div
								className={`bg-secondary rounded animate__animated animate__backInRight mb-2 ${opacity}`}
								style={{ ...styles }}>
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
									setOpacity={setOpacity}
								/>
							</div>
						);
					})}
				</div>
				<button
					className='btn btn-lg bg-success m-4'
					onClick={() => {
						setSessionsArr((prev) => [...prev, defaultSession]);
						console.log(sessionsArr);
						setEventJSON({ ...eventJSON, sessions: sessionsArr });
						// setRows(rows + 1);
					}}>
					<i className='bi bi-plus-lg' style={{ color: 'white' }}></i>
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
