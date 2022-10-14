let startdate=Schedule.startDate
let enddate=Schedule.endDate

let elapseMSec=enddate.getTime()-startdate.getTime();
let elapsedSec=elapseMSec/1000;
let elapsedMin=elapsedSec/60;
let elapsedHour=elapsedMin/60;