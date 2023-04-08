
const SavrState = {
  UNSET : 'UNSET',
  LIVE : 'LIVE',
  SANDBOX : 'SANDBOX'
}

class SavrException extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

const SAVR_LOCAL_JSON_CONFIG_PATH_SAVR_CONST = '/savr_local_config.json';
const SAVR_MACHINE_PORT_KEY_SAVR_CONST = 'prefsport';
const SAVR_SAVE_ITEMS_PATH_SAVR_CONST = '/save-pref';
const SAVR_FETCH_ITEMS_PATH_SAVR_CONST =  '/fetch-pref';
const SAVR_CLEAR_ITEMS_PATH_SAVR_CONST = '/clear-prefs';
const SAVR_PUSH_NOTIFY_PATH_SAVR_CONST = '/push-notify';

export class SavrClient{

    constructor(){
        this.localMap = {};
        this.localData = {};
        this.state = SavrState.UNSET;
        this.appId = '';
    }
      
    // initialise client- find savr-local-config.json else test mode
    async initialise(id) {
        appId = id;
        if (typeof window === 'undefined') {
          this.localMap = {};
          this.state = SavrState.SANDBOX;
          return SavrState.SANDBOX;
        }
        var baseUrl = window.location.origin;
        var response = await fetch(baseUrl + SAVR_LOCAL_JSON_CONFIG_PATH_SAVR_CONST);
        if(response.status !== 200 ){
            this.localMap = {};
            this.state = SavrState.SANDBOX;
            return SavrState.SANDBOX;
        }
        var data = await response.json();
        this.localData = data;
        this.state = SavrState.LIVE;
        return SavrState.LIVE;
    }
  
    // Save items
   async saveItems(map){
      if(state === SavrState.UNSET ){
          throw new SavrException('Savr not initialised');
      }
      if(state == SavrState.SANDBOX){
          try{
              for(var [key, value] of Object.entries(map)){
                  localMap[key] = String(value);
              }
          }catch(e){
              throw new SavrException(e);
          }
        }  else{
            const URL = 'http://127.0.0.1:' + localData[SAVR_MACHINE_PORT_KEY_SAVR_CONST] + SAVR_SAVE_ITEMS_PATH_SAVR_CONST;
            const request =  await fetch(URL, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                "Authorization": this.appId
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify({
                  'prefs':map}), // body data type must match "Content-Type" header
            });
            if(request.status !== 200){
                throw new SavrException(request.responseText);
            }
        }
        return true;
    }
  
    // Fetch items 
   async fetchItems(keysList){
      if(state === SavrState.UNSET ){
          throw new SavrException('Savr not initialised');
      }
        var result = {};
        if(state == SavrState.SANDBOX){
            try{
                for(var key of keysList){
                    if(key in localMap){
                        result[key] = this.localMap[key];
                    }else{
                        result[key]='';
                    }
                }
            }catch(e){
                throw new SavrException(e);
            }
        }else{
            const URL = 'http://127.0.0.1:' + this.localData[SAVR_MACHINE_PORT_KEY_SAVR_CONST] + SAVR_FETCH_ITEMS_PATH_SAVR_CONST;
            const request = await fetch(URL, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                "Authorization": this.appId
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", 
              body: JSON.stringify({'keys': keysList}), 
          });
            if(request.status !== 200){
                throw new SavrException(await request.text());
            }
            result = request.json();
        }
        return result;
    }
  
    // Current- state
    getState(){
        return this.state;
    }
  
    // Clear prefs
   async clearPrefs(){
      if(state === SavrState.UNSET ){
          throw new SavrException('Savr not initialised');
      }
        localMap={};
        if(state !== SavrState.SANDBOX){
            const URL = 'http://127.0.0.1:' + this.localData[SAVR_MACHINE_PORT_KEY_SAVR_CONST] + SAVR_CLEAR_ITEMS_PATH_SAVR_CONST;
            const request =  await fetch(URL, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                "Authorization": this.appId
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify({}), // body data type must match "Content-Type" header
            });
            if(request.status !== 200){
                throw new SavrException(request.text());
            }
        }
        return true;
    }
    
    // Push notification
    async triggerPushNotification() {
      if(state === SavrState.UNSET ){
          throw new SavrException('Savr not initialised');
      }
        localMap={};
        if(state === SavrState.LIVE ){
            const URL = 'http://127.0.0.1:' + this.localData[SAVR_MACHINE_PORT_KEY_SAVR_CONST] + SAVR_PUSH_NOTIFY_PATH_SAVR_CONST;
            const request = await fetch(URL, {
              method: "POST", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                "Authorization": this.appId
              },
              redirect: "follow", // manual, *follow, error
              referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              body: JSON.stringify({}), // body data type must match "Content-Type" header
            });
            if(request.status !== 200){
                throw new SavrException(request.responseText);
            }
        }
        return true;
    }
}


