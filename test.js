import {SavrClient} from './savr_js_client.js'

const savr = SavrClient();

console.log( savr.initialise('thdrhfjfty'));    

assert(savr.saveItems({'test1':1, 'test':2}), true);

assert(savr.fetchItems (['test1', 'test']), {'test1':'1', 'test':'2'});

assert(savr.triggerPushNotification(), true);

