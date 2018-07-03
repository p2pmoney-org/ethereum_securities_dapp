'use strict';

class Securities {
	
	// "constants"
	static get STATUS_LOST() { return -100;}	

	static get STATUS_NOT_FOUND() { return -20;}	
	static get STATUS_UNKOWN() { return -10;}	

	static get STATUS_LOCAL() { return 1;}
	
	static get STATUS_SENT() { return 10;}	
	static get STATUS_PENDING() { return 100;}	
	
	static get STATUS_DEPLOYED() { return 200;}	
	static get STATUS_CANCELLED() { return 300;}	
	static get STATUS_REJECTED() { return 400;}	
	
	static get STATUS_ON_CHAIN() { return 1000;}	

}


if ( typeof GlobalClass !== 'undefined' && GlobalClass )
	GlobalClass.registerModuleClass('securities', 'Securities', Securities);
else
	module.exports = StakeHolder; // we are in node js