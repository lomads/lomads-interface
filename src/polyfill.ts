import { Buffer } from 'buffer';

(window as any).global = window;
window.Buffer = Buffer;
global.Buffer = Buffer;
global.process = {
    env: { DEBUG: undefined },
    version: '',
    nextTick: require('next-tick')
} as any;