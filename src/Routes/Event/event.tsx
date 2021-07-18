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

interface Settings {
	serverName: string;
	adminPassword: string;
	carGroup: string;
	trackMedalsRequirement: number;
	safetyRatingRequirement: number;
	racecraftRatingRequirement: number;
	password: string;
	spectatorPassword: string;
	maxCarSlots: number;
	dumpLeaderboards: number;
	isRaceLocked: number;
	randomizeTrackWhenEmpty: number;
	allowAutoDQ: number;
	shortFormationLap: number;
	dumpEntryList: number;
	formationLapType: number;
}

const defaultSettings: Settings = {
	serverName: '',
	adminPassword: '',
	carGroup: 'FreeForAll',
	trackMedalsRequirement: -1,
	safetyRatingRequirement: -1,
	racecraftRatingRequirement: -1,
	password: '',
	spectatorPassword: '',
	maxCarSlots: 24,
	dumpLeaderboards: 1,
	isRaceLocked: 1,
	randomizeTrackWhenEmpty: 0,
	allowAutoDQ: 1,
	shortFormationLap: 1,
	dumpEntryList: 1,
	formationLapType: 1,
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
	const [serverName, setServerName] = useState('');
	const [settingsJSON, setSettingsJSON] = useState(defaultSettings);
	const [isPrivateServer, setIsPrivateServer] = useState(false);

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

	function handleSettingsJSON(
		event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
	): void {
		setSettingsJSON({
			...settingsJSON,
			[event.target.id]: event.target.value,
		});
	}

	function handleCheckboxJSON(event: ChangeEvent<HTMLInputElement>) {
		if (isPrivateServer) {
			setIsPrivateServer(false);
			setSettingsJSON({
				...settingsJSON,
				password: '',
			});
		} else {
			setIsPrivateServer(true);
		}
	}

	return (
		<div className='row justify-content-around'>
			<div className='col-10  align-center'>
				<div>
					<h1 className='h1 text-center'>ACC Server Setup Tool</h1>
					<div className='row align-items-start justify-content-evenly'>
						<div className='col'>
							<label htmlFor='serverName'>Server Name</label>
							<input
								type='text'
								name='serverName'
								id='serverName'
								value={settingsJSON.serverName}
								onChange={handleSettingsJSON}
							/>
						</div>
						<div className='col'>
							<label htmlFor='carGroup'>Car Group</label>
							<select
								name='carGroup'
								id='carGroup'
								onChange={handleSettingsJSON}>
								<option value='FreeForAll' selected>
									All Cars
								</option>
								<option value='GT3'>GT3</option>
								<option value='GT4'>GT4</option>
								<option value='Cup'>Porsche Cup</option>
								<option value='ST'>Super Trofeo</option>
							</select>
						</div>
						<div className='col'>
							<label htmlFor='adminPassword'>
								Admin Password
							</label>
							<input
								type='text'
								name='adminPassword'
								id='adminPassword'
								value={settingsJSON.adminPassword}
								onChange={handleSettingsJSON}
							/>
						</div>
						<div className='col'>
							<label htmlFor='adminPassword'>
								Spectator Password
							</label>
							<input
								type='text'
								name='spectatorPassword'
								id='spectatorPassword'
								value={settingsJSON.spectatorPassword}
								onChange={handleSettingsJSON}
							/>
						</div>
					</div>
					<div className='row'>
						<h2>Server Requirements</h2>
					</div>
					<div className='row align-items-start justify-content-evenly'>
						<div className='col  py-3'>
							<label>Track Medals</label>
							<input
								onChange={(e) => handleSettingsJSON(e)}
								type='number'
								id='trackMedalsRequirement'
								min='-1'
								max='3'
								value={settingsJSON.trackMedalsRequirement}
							/>
						</div>
						<div className='col py-3'>
							<label>Safety Rating</label>
							<input
								onChange={(e) => handleSettingsJSON(e)}
								type='number'
								id='safetyRatingRequirement'
								min='-1'
								max='99'
								value={settingsJSON.safetyRatingRequirement}
							/>
						</div>
						<div className='col py-3'>
							<label>Racecraft Rating</label>
							<input
								onChange={(e) => handleSettingsJSON(e)}
								type='number'
								id='racecraftRatingRequirement'
								min='-1'
								max='99'
								value={settingsJSON.racecraftRatingRequirement}
							/>
						</div>
						<div className='col py-3'>
							<label htmlFor='maxCarSlots'>Car Slots</label>
							<input
								onChange={(e) => handleSettingsJSON(e)}
								type='number'
								id='maxCarSlots'
								min='10'
								max='99'
								value={settingsJSON.maxCarSlots}
							/>
						</div>
						<div className='row align-items-start justify-content-evenly'>
							<div className='col py-3'>
								<label>Is this a private server?</label>
								<input
									type='checkbox'
									name='privateServer'
									id='privateServer'
									checked={isPrivateServer}
									onChange={(e) => handleCheckboxJSON(e)}
								/>
							</div>

							{isPrivateServer && (
								<div className='col py-3'>
									<label htmlFor='password'>
										Server Password
									</label>
									<input
										type='text'
										name='password'
										id='password'
										value={settingsJSON.password}
										onChange={handleSettingsJSON}
									/>
								</div>
							)}
						</div>
					</div>
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
									value={eventJSON.ambientTemp}
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
									value={eventJSON.cloudLevel * 10}
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
									value={eventJSON.rain * 10}
								/>
							</div>
						</div>
					</div>
				</div>
				{/* {displayedSessions} */}
				<div className=''>
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
								setOpacity={setOpacity}
								opacity={opacity}
							/>
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
			<div>
				<pre>
					<code>{JSON.stringify(settingsJSON, null, 2)}</code>
				</pre>
			</div>
			<a
				href={`data:text/json;charset=utf-8,${encodeURIComponent(
					JSON.stringify(eventJSON, null, 2)
				)}`}
				download='event.json'>
				<button>Download</button>
			</a>
		</div>
	);
}
