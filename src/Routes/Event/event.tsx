import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import Sessions from '../../components/Sessions';
import TrackList from './tracks.json';
import Input from '../../components/Input';

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

interface EventRules {
	qualifyStandingType: number;
	pitWindowLengthSec: number;
	mandatoryPitstopCount: number;
	isRefuellingAllowedInRace: boolean;
	isRefuellingTimeFixed: boolean;
	isMandatoryPitstopRefuellingRequired: boolean;
	isMandatoryPitstopTyreChangeRequired: boolean;
	tyreSetCount: number;
}

const defaultEventRules: EventRules = {
	qualifyStandingType: 1,
	pitWindowLengthSec: 0,
	mandatoryPitstopCount: 0,
	isRefuellingAllowedInRace: true,
	isRefuellingTimeFixed: false,
	isMandatoryPitstopRefuellingRequired: true,
	isMandatoryPitstopTyreChangeRequired: true,
	tyreSetCount: 40,
};

export default function EventRoute() {
	const [year, setYear] = useState(TrackList[0].year);
	const [track, setTrack] = useState(TrackList[0].tracks[0].trackName);
	const [eventJSON, setEventJSON] = useState(defaultEvent);
	const [sessionsArr, setSessionsArr] = useState<Array<SessionObj>>([
		defaultSession,
	]);
	const [rows, setRows] = useState(1);
	const [settingsJSON, setSettingsJSON] = useState(defaultSettings);
	const [eventRulesJSON, setEventRulesJSON] = useState(defaultEventRules);
	const [isPrivateServer, setIsPrivateServer] = useState(false);
	const [mandatoryPit, setMandatoryPit] = useState(false);

	function handleSelectTrack(
		event:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLSelectElement>
	): void {
		if (event.target.id === 'cloudLevel' || event.target.id === 'rain') {
			let rounded = parseInt(event.target.value) / 10;
			setEventJSON({
				...eventJSON,
				[event.target.id]: rounded,
			});
		} else if (event.target.id === 'weatherRandomness') {
			let parsed = parseInt(event.target.value);
			setEventJSON({
				...eventJSON,
				[event.target.id]: parsed,
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
		if (
			event.target.id === 'trackMedalsRequirement' ||
			event.target.id === 'safetyRatingRequirement' ||
			event.target.id === 'racecraftRatingRequirement' ||
			event.target.id === 'maxCarSlots'
		) {
			setSettingsJSON({
				...settingsJSON,
				[event.target.id]: parseInt(event.target.value),
			});
		} else {
			setSettingsJSON({
				...settingsJSON,
				[event.target.id]: event.target.value,
			});
		}
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

	function handleEventRules(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.id === 'tyreSetCount') {
			let parsed = parseInt(event.target.value);
			setEventRulesJSON({
				...eventRulesJSON,
				[event.target.id]: parsed,
			});
		} else if (event.target.id === 'pitWindowLengthSec') {
			let convertedToSec = parseInt(event.target.value) * 60;
			setEventRulesJSON({
				...eventRulesJSON,
				[event.target.id]: convertedToSec,
			});
		} else {
			setEventRulesJSON({
				...eventRulesJSON,
				[event.target.id]: event.target.value,
			});
		}
	}

	function handleCheckboxes(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.id === 'mandatoryPit') {
			if (mandatoryPit) {
				setMandatoryPit(false);
			} else {
				setMandatoryPit(true);
			}
		}
	}

	return (
		<div className='container'>
			<div className='row'>
				<div className='col'>
					<h1 className='h1 text-center mt-5'>
						ACC Server Setup Tool
					</h1>
					<div className='row align-items-start justify-content-evenly'>
						<Input
							name='serverName'
							valueName={settingsJSON.serverName}
							type='text'
							handledChange={handleSettingsJSON}
							label='Server Name'
						/>
						<div className='col-2 p-3 form-group'>
							<label className='p-2' htmlFor='carGroup'>
								Car Group
							</label>
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
						<Input
							label='Admin Password'
							type='text'
							name='adminPassword'
							valueName={settingsJSON.adminPassword}
							handledChange={handleSettingsJSON}
						/>
						<Input
							label='Spectator Password'
							type='text'
							name='spectatorPassword'
							valueName={settingsJSON.spectatorPassword}
							handledChange={handleSettingsJSON}
						/>
					</div>
					<div className='row text-center'>
						<h2>Server Requirements</h2>
					</div>
					<div className='row align-items-start justify-content-evenly'>
						<Input
							label='Track Medals'
							type='number'
							name='trackMedalsRequirement'
							min={-1}
							max={3}
							valueName={settingsJSON.trackMedalsRequirement}
							handledChange={handleSettingsJSON}
						/>
						<Input
							label='Safety Rating'
							type='number'
							name='safetyRatingRequirement'
							min={-1}
							max={99}
							valueName={settingsJSON.safetyRatingRequirement}
							handledChange={handleSettingsJSON}
						/>
						<Input
							label='Racecraft Rating'
							type='number'
							name='racecraftRatingRequirement'
							min={-1}
							max={99}
							valueName={settingsJSON.racecraftRatingRequirement}
							handledChange={handleSettingsJSON}
						/>
						<Input
							label='Car Slots'
							type='number'
							name='maxCarSlots'
							min={10}
							max={99}
							valueName={settingsJSON.maxCarSlots}
							handledChange={handleSettingsJSON}
						/>

						<div className='row  justify-content-evenly'>
							<div className='col-4 p-3 form-group'>
								<label className='p-2' htmlFor='year'>
									Select Year
								</label>
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
							<div className='col-4 p-3 form-group'>
								<label className='p-2' htmlFor='track'>
									{' '}
									Select Track{' '}
								</label>
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
															value={
																track.trackName
															}>
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
							<div className='row justify-content-evenly align-center my-3'>
								<Input
									type='number'
									label='Temp'
									name='ambientTemp'
									valueName={eventJSON.ambientTemp}
									handledChange={handleSelectTrack}
									min={15}
									max={42}
								/>
								<Input
									type='number'
									label='Clouds'
									name='cloudLevel'
									valueName={eventJSON.cloudLevel * 10}
									handledChange={handleSelectTrack}
									min={0}
									max={10}
								/>
								<Input
									type='number'
									label='Rain'
									name='rain'
									valueName={eventJSON.rain}
									handledChange={handleSelectTrack}
									min={0}
									max={10}
								/>
								<Input
									type='number'
									label='Randomness'
									name='weatherRandomness'
									valueName={eventJSON.weatherRandomness}
									handledChange={handleSelectTrack}
									min={0}
									max={10}
								/>
							</div>
						</div>
					</div>
					<div className='row  justify-content-evenly'>
						<div className='col py-3'>
							<Input
								label='Is this a private server?'
								type='checkbox'
								name='privateServer'
								isChecked={isPrivateServer}
								handledChange={handleCheckboxJSON}
							/>
						</div>

						{isPrivateServer && (
							<Input
								label='Server Password'
								type='text'
								name='password'
								valueName={settingsJSON.password}
								handledChange={handleSettingsJSON}
							/>
						)}
					</div>
					{isPrivateServer && (
						<div className='row  justify-content-evenly'>
							<div className='col text-center'>
								<h2>Event Rules</h2>
							</div>
							<div className='row justify-content-evenly align-center'>
								<Input
									type='number'
									name='tyreSetCount'
									valueName={eventRulesJSON.tyreSetCount}
									label='Tire Sets'
									handledChange={handleEventRules}
									min={1}
									max={50}
								/>
								<Input
									label='Mandatory Pit?'
									type='checkbox'
									name='mandatoryPit'
									isChecked={mandatoryPit}
									handledChange={handleCheckboxes}
								/>
							</div>
							{mandatoryPit && (
								<div className='row justify-content-evenly'>
									<Input
										type='number'
										name='pitWindowLengthSec'
										valueName={
											eventRulesJSON.pitWindowLengthSec /
											60
										}
										label='Pit Window'
										handledChange={handleEventRules}
										min={5}
										max={90}
									/>
								</div>
							)}
						</div>
					)}
				</div>
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
							/>
						);
					})}
				</div>
				<button
					className='btn btn-lg bg-success '
					onClick={() => {
						setSessionsArr((prev) => [...prev, defaultSession]);
						console.log(sessionsArr);
						setEventJSON({ ...eventJSON, sessions: sessionsArr });
						setRows(rows + 1);
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
					<code>{JSON.stringify(eventRulesJSON, null, 2)}</code>
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
