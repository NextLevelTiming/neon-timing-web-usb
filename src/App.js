import './App.css';
import DeviceManger from "./DeviceManger";
import {useEffect, useState} from "react";

function App() {
    const [isDisabled, setIsDisabled] = useState(("serial" in navigator));
    const [isConnected, setIsConnected] = useState(false);
    const [transponder, setTransponder] = useState('');

    useEffect(() => {
        const onConnect = (event) => {
            setIsDisabled(false);
            setIsConnected(true);

            setTimeout(() => {

                // Get preferences
                DeviceManger.sendCommand({
                    cmd: 'preferences_get',
                    name: 'transponder'
                });
            }, 1);
        };

        DeviceManger.addEventListener('connect', onConnect);

        return () => {
            window.removeEventListener('connect', onConnect);
        }
    }, [isDisabled, isConnected]);

    useEffect(() => {
        const onDisconnect = (event) => {
            setIsDisabled(true);
            setIsConnected(false);
        };

        DeviceManger.addEventListener('disconnect', onDisconnect);

        return () => {
            window.removeEventListener('disconnect', onDisconnect);
        }
    }, [isDisabled, isConnected]);

    useEffect(() => {
        const onMessage = (event) => {
            if (event.detail.name === 'transponder') {
                setTransponder(event.detail.value);
            }
        };

        DeviceManger.addEventListener('preferences_value', onMessage);

        return () => {
            window.removeEventListener('preferences_value', onMessage);
        }
    }, [transponder]);


    return (
        <div className="App prose container-md mx-auto mt-24">
            <h1>Neon Timing Toolkit</h1>

            <p className="py-6">
                Read about the Neon Timing Protocol on <a href="https://github.com/NextLevelTiming/neon-timing-protocol"
                                                          target="_blank">Github</a>. This is a tool to help you test
                devices that have the protocol implemented.
            </p>

            <div className="divider"></div>

            {!("serial" in navigator) && <div role="alert" className="alert alert-error">
                <span>Your browser is not supported! Please use another.</span>
                <div>
                    <a className="btn btn-sm btn-primary"
                       href="https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility"
                       target="_blank">Compatible Browsers</a>
                </div>
            </div>}

            <p>
                {!isConnected &&
                    <button disabled={!("serial" in navigator)} className="btn btn-accent"
                            onClick={() => DeviceManger.init()}>Connect Device</button>}
                {isConnected &&
                    <button className="btn btn-error"
                            onClick={() => DeviceManger.disconnect()}>Disconnect Device</button>}
            </p>

            <h2>Firmware</h2>
            <p>
                <strong>Current version</strong><br />
                Not flashed with Neon Timing firmware.
            </p>
            <p>
                <button disabled={isDisabled} className="btn btn-outline btn-accent"
                        onClick={() => DeviceManger.flash()}>Flash device with latest firmware
                </button>
            </p>

            <h2>Flag Events</h2>
            <div className="join">
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'flag',
                            type: 'red'
                        })}>Red Flag
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'flag',
                            type: 'green'
                        })}>Green Flag
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'flag',
                            type: 'white'
                        })}>White Flag
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'flag',
                            type: 'clear'
                        })}>Clear Flag
                </button>
            </div>

            <h2>Race Events</h2>
            <div className="join">
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'race_staging'
                        })}>Race Staging
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'race_started'
                        })}>Race Started
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'race_time_over'
                        })}>Race Time Over
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'race_completed'
                        })}>Race Complete
                </button>
            </div>

            <h2>Countdown Events</h2>
            <div className="join">
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'countdown_started'
                        })}>Countdown Started
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'countdown_end_delay_started'
                        })}>Countdown End Delay Started
                </button>
            </div>

            <h2>Racer Passed Gate Events</h2>
            <div className="join">
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'racer_passed_gate',
                            transponder: '1',
                            lap: true,
                            streak_laps: 0,
                            fast: false
                        })}>Regular Lap
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'racer_passed_gate',
                            transponder: '1',
                            lap: true,
                            streak_laps: 1,
                            fast: false
                        })}>Streak Lap
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'racer_passed_gate',
                            transponder: '1',
                            lap: true,
                            streak_laps: 1,
                            fast: true
                        })}>Fast Streak Lap
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'event',
                            evt: 'race',
                            type: 'racer_passed_gate',
                            transponder: '1',
                            lap: true,
                            streak_laps: 0,
                            fast: true
                        })}>Fast Lap
                </button>
            </div>

            <h2>Preferences</h2>
            <div className="join">
                <label className="input input-bordered flex items-center gap-2 join-item">
                    Transponder
                    <input disabled={isDisabled} type="text"
                           className="grow" value={transponder}
                           maxLength={10}
                           onChange={e => setTransponder(e.target.value)}/>
                </label>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'preferences_set',
                            name: 'transponder',
                            value: transponder
                        })}>Set
                </button>
                <button disabled={isDisabled} className="btn btn-outline btn-accent join-item"
                        onClick={() => DeviceManger.sendCommand({
                            cmd: 'preferences_set',
                            name: 'transponder',
                            value: ''
                        })}>Unset
                </button>
            </div>


            <div className="alert mt-8">
                <span>The console displays communication between the device and the pc.</span>
            </div>
        </div>
    );
}

export default App;
