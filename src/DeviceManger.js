import LineBreakTransformer from "./LineBreakTransformer";

class DeviceManger extends EventTarget {
    port = null;
    reader = null;

    constructor() {
        super();
        navigator.serial.addEventListener("connect", (e) => {
            console.log({e}, 'connected');
            // Connect to `e.target` or add it to a list of available ports.
        });

        navigator.serial.addEventListener("disconnect", (e) => {
            console.log({e}, 'disconnect');

            this.dispatchEvent(new Event('disconnect'));
            // Remove `e.target` from the list of available ports.
        });

        navigator.serial.getPorts().then((ports) => {
            console.log({ports}, 'get ports');
            // Initialize the list of available ports with `ports` on page load.
        });
    }

    init() {
        const usbVendorId = 0xabcd;
        navigator.serial
            .requestPort({})
            .then(async port => {
                // Connect to `port` or add it to the list of available ports.
                this.port = port;
                await port.open({baudRate: 115200});
                this.read();
                this.sendInitCommand();
            })
            .catch((e) => {
                // The user didn't select a port.
                this.port = null;
                console.log('error', {e});
            });
    }

    async read() {
        while (this.port && this.port.readable) {
            const textDecoder = new TextDecoderStream();
            const readableStreamClosed = this.port.readable.pipeTo(textDecoder.writable);
            this.reader = textDecoder.readable
                .pipeThrough(new TransformStream(new LineBreakTransformer()))
                .getReader();

            try {
                while (true) {
                    const {value, done} = await this.reader.read();
                    if (done) {
                        // |reader| has been canceled.
                        break;
                    }

                    // Do something with |value|...
                    console.log({value});

                    try {
                        const message = JSON.parse(value);

                        if (message.cmd === 'handshake_init') {
                            await this.sendCommand({
                                cmd: 'handshake_ack',
                                init_time: message.time,
                                events: ['*']
                            });
                        } else if (message.cmd === 'handshake_ack') {
                            this.dispatchEvent(new Event('connect'));
                        } else if (message.cmd === 'preferences_value') {
                            this.dispatchEvent(new CustomEvent('preferences_value', { detail: message }));
                        } else if (message.cmd === 'event') {
                            this.errorLogCount += 1;
                            this.errorLogCountReport += 1;
                        }
                    } catch (e) {
                        console.log('bad json response. That is okay');
                    }
                }
            } catch (e) {
                console.log('error', e);
                if (e.type === 'disconnect') {
                    this.dispatchEvent(new Event('disconnect'));
                }
            } finally {
                this.reader.releaseLock();
                await readableStreamClosed.catch(reason => {});
                await this.port.close();
            }
        }
    }

    async sendInitCommand() {
        await this.sendCommand({
            cmd: 'handshake_init',
            events: ['*']
        });
    }

    async sendCommand(command = {}) {
        const message = {
            ...command,
            device: 'hosty host',
            protocol: 'NT1',
            time: Date.now(),
            did: 'HOST-1234567890A'
        }
        const data = JSON.stringify(message, null, 0) + '\n';
        console.log(data);
        await this.writeAndDrainData(data);
    }

    async writeAndDrainData(str) {
        const writer = this.port.writable.getWriter();

        const ret = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++) {
            ret[i] = str.charCodeAt(i);
        }
        await writer.write(ret);

        // Allow the serial port to be closed later.
        writer.releaseLock();
    }

    async disconnect() {
        this.reader.cancel();
        this.dispatchEvent(new Event('disconnect'));
        // this.reader.releaseLock();
        // this.port.close();
    }
}

export default new DeviceManger();
