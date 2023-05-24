// let hrs = Math.floor(time / 3600000);
// let shrs = String(hrs);
// let mins = Math.floor((time % 3600000) / 60000);
// let smins = String(mins);
// let secs = Math.floor(((time % 3600000) % 60000) / 1000);
// let ssecs = String(secs);
// let msecs = ((time % 3600000) % 60000) % 1000;
// let smsecs = String(msecs);

function timerTab() {
  $(".stopWatchTab").css("display", "none");
  $("#stopwatch-tab-btn").css("border-color", "darkgray");
  $(".timerTab").css("display", "block");
  $("#timer-tab-btn").css("border-color", "rgb(46, 241, 231)");
}

function stopWatchTab() {
  $(".timerTab").css("display", "none");
  $("#timer-tab-btn").css("border-color", "darkgray");
  $(".stopWatchTab").css("display", "block");
  $("#stopwatch-tab-btn").css("border-color", "rgb(46, 241, 231)");
}

let noOfTimers = 1;
let timerData = {
  1: {
    name: "Timer1",
    time: 120,
  },
};
let timersId = {};
let clocks = {
  1: [120, 0],
};
function openModal() {
  $(".modal-bg").removeClass("none");
  $(".modal").removeClass("none");
  let index = event.target.value;
  $(".done-btn").val(index);
  let time = timerData[index].time;
  let name = timerData[index].name;
  let hrs = Math.floor(time / 3600);
  let mins = Math.floor((time % 3600) / 60);
  let secs = (time % 3600) % 60;
  $("#hrs").val(`${hrs}`);
  $("#mins").val(`${mins}`);
  $("#secs").val(`${secs}`);
  $("#timer-name").val(`${name}`);
  leadingZeroes(document.querySelector("#hrs"));
  leadingZeroes(document.querySelector("#mins"));
  leadingZeroes(document.querySelector("#secs"));
}

function closeModal() {
  $(".modal-bg").addClass("none");
  $(".modal").addClass("none");
}

function addTimer() {
  noOfTimers++;
  timerData[noOfTimers] = { name: `Timer${noOfTimers}`, time: 120 };
  clocks[noOfTimers] = [120];
  clocks[noOfTimers].push(0);
  $(".timers-wrapper").append(`
    <div id=${noOfTimers} class="timer">
        <div class="display">
            <span>00:02:00</span>
            <button class="control dark" value=${noOfTimers} onclick="start()">start</button>
            <button class="control light" value=${noOfTimers} onclick="reset()">reset</button>
            <button value=${noOfTimers} class="remove" onclick="removeTimer()">&times; remove</button>
        </div>
        <div class="timer-operation">
            <div class="timer-info">
                <span class="timer-name">Timer${noOfTimers} (00:02:00)</span>
                <button class="edit-timer" value=${noOfTimers} onclick="openModal()"><i class="fa-solid fa-pen"></i> Edit</button>
            </div>
            <div class="time-bar">
                <div class="bar"></div>
            </div>
        </div>
    </div>
    `);
}

function removeTimer() {
  let index = event.target.value;
  delete timerData[noOfTimers];
  $(`#${index}`).remove();
}

function changeDisplayTime(index, shrs, smins, ssecs) {
  if (shrs.length === 1) {
    shrs = "0" + shrs;
  }
  if (smins.length === 1) {
    smins = "0" + smins;
  }
  if (ssecs.length === 1) {
    ssecs = "0" + ssecs;
  }
  $(`#${index} .display span`).html(`${shrs}:${smins}:${ssecs}`);
}

function translateBar(index, time, initialTime) {
  let x = ((initialTime - time) / initialTime) * 100;
  $(`#${index} .bar`).css("transform", `translateX(-${x}%)`);
}

function setTimer(el) {
  const index = el.value;
  const hrs = Number($("#hrs").val());
  const shrs = hrs < 10 ? "0" + String(hrs) : String(hrs);
  const mins = Number($("#mins").val());
  const smins = mins < 10 ? "0" + String(mins) : String(mins);
  const secs = Number($("#secs").val());
  const ssecs = secs < 10 ? "0" + String(secs) : String(secs);
  const timerName = $("#timer-name").val();
  let time = secs + mins * 60 + hrs * 3600;
  timerData[index].time = time;
  clocks[index][0] = time;
  clocks[index].push(0);
  changeDisplayTime(index, shrs, smins, ssecs);
  $(`#${index} .timer-name`).html(
    `${timerData[index].name} ${shrs}:${smins}:${ssecs}`
  );
  if (timerName != "") {
    timerData[index].name = timerName;
  }
  closeModal();
}

function leadingZeroes(input) {
  if (input.value < 0) {
    input.value = 0;
  }
  if (input.value.length === 1) {
    input.value = "0" + input.value;
  }
}

function start() {
  let el = event.target;
  let index = el.value;
  if (el.innerHTML === "start") {
    el.style.background = "rgb(255, 71, 71)";
    el.innerHTML = "stop";
    let initialTime = timerData[index].time;
    let time = clocks[index][0];
    let timerId = setInterval(() => {
      time--;
      if (time <= 0) {
        var audio = new Audio("static/audio/best_alarm.mp3");
        audio.play();
        clearInterval(timerId);
        reset(index);
        el.style.background = "lightgreen";
        el.innerHTML = "done";
      }
      let hrs = Math.floor(time / 3600);
      let mins = Math.floor((time % 3600) / 60);
      let secs = (time % 3600) % 60;
      clocks[index][0] = time;
      changeDisplayTime(index, String(hrs), String(mins), String(secs));
    }, 1000);

    let xBar = clocks[index][1];
    let BarInterval = (initialTime * 1000) / 1000;

    let barId = setInterval(() => {
      $(`#${index} .bar`).css("transform", `translateX(-${xBar}%)`);
      xBar += 0.1;
      if (xBar >= 1000) {
        clearInterval(barId);
      }
      clocks[index][1] = xBar;
    }, BarInterval);

    timersId[index] = [timerId];
    timersId[index].push(barId);
    console.log(timersId[index]);
  } else {
    clearInterval(timersId[index][0]);
    clearInterval(timersId[index][1]);
    el.style.background = "rgb(46, 241, 231)";
    el.innerHTML = "start";
  }
}

function reset(index) {
  clocks[index] = [timerData[index].time];
  clocks[index].push(0);
  clearInterval(timersId[index][0]);
  clearInterval(timersId[index][1]);
  let time = timerData[index].time;
  let hrs = Math.floor(time / 3600);
  const shrs = hrs < 10 ? "0" + String(hrs) : String(hrs);
  let mins = Math.floor((time % 3600) / 60);
  const smins = mins < 10 ? "0" + String(mins) : String(mins);
  let secs = (time % 3600) % 60;
  const ssecs = secs < 10 ? "0" + String(secs) : String(secs);
  $(`#${index} .display span`).html(`${shrs}:${smins}:${ssecs}`);
  $(`#${index} .timer-name`).html(
    `${timerData[index].name} ${shrs}:${smins}:${ssecs}`
  );
  $(`#${index} .bar`).css("transform", `translateX(0)`);
}

/////////////////////////////////////////    stopwatch

let stpWatchId = 0;
let mstpWatchId = 0;
let mstartTime = 0;
let startTime = 0;
let stpTime = 0;
let mstpTime = 0;
let noSplit = 1;
let t = 0;
let mt = 0;

function changeStopWatchDisplay(shrs, smins, ssecs, smsecs, className) {
  if (shrs.length === 1) shrs = "0" + shrs;
  if (smins.length === 1) smins = "0" + smins;
  if (ssecs.length === 1) ssecs = "0" + ssecs;
  if (smsecs.length < 3) smsecs = "00" + smsecs;
  $(className).html(
    `${shrs}:${smins}:${ssecs}.${smsecs.slice(
      0,
      1
    )}<span class="millisec">${smsecs.slice(1)}</span>`
  );
}
function startStp(el) {
  if (el.innerHTML == "Start") {
    el.innerHTML = "Pause";
    $("#split-btn-var").addClass("split-btn-var");
    $("#split-btn-var").attr("onclick", "splitStp()");
    $("#rst-btn-var").removeClass("rst-btn-var");
    $("#rst-btn-var").attr("onclick", "");

    startTime = Date.now();
    mstartTime = startTime;
    stpWatchId = setInterval(() => {
      t = Date.now() - startTime + stpTime;
      let hrs = Math.floor(t / 3600000);
      t = t % 3600000;
      let mins = Math.floor(t / 60000);
      t = t % 60000;
      let secs = Math.floor(t / 1000);
      let msecs = t % 1000;
      changeStopWatchDisplay(
        String(hrs),
        String(mins),
        String(secs),
        String(msecs),
        "#stp-time"
      );
    }, 1);
    mstpWatchId = setInterval(() => {
      mt = Date.now() - mstartTime + mstpTime;
      let hrs = Math.floor(mt / 3600000);
      mt = mt % 3600000;
      let mins = Math.floor(mt / 60000);
      mt = mt % 60000;
      let secs = Math.floor(mt / 1000);
      let msecs = mt % 1000;
      changeStopWatchDisplay(
        String(hrs),
        String(mins),
        String(secs),
        String(msecs),
        "#millistp"
      );
    }, 1);
  } else {
    $("#split-btn-var").removeClass("split-btn-var");
    $("#split-btn-var").attr("onclick", "");
    $("#rst-btn-var").addClass("rst-btn-var");
    $("#rst-btn-var").attr("onclick", "resetStp()");
    stpTime = t;
    mstpTime = mt;
    el.innerHTML = "Start";
    clearInterval(stpWatchId);
    clearInterval(mstpWatchId);
  }
}
function splitStp() {
  let hrs = Math.floor(t / 3600000);
  t = t % 3600000;
  let mins = Math.floor(t / 60000);
  t = t % 60000;
  let secs = Math.floor(t / 1000);
  let msecs = t % 1000;

  let mhrs = Math.floor(mt / 3600000);
  mt = mt % 3600000;
  let mmins = Math.floor(mt / 60000);
  mt = mt % 60000;
  let m1secs = Math.floor(mt / 1000);
  let mmsecs = mt % 1000;
  $("#stp-table").append(
    `<tr>
                    <td class="table-data">#${noSplit}</td>
                    <td class="table-data millistp">${mhrs}:${mmins}:${m1secs}:${mmsecs}</td>
                    <td class="table-data">${hrs}:${mins}:${secs}:${msecs}</td>
                    <td class="table-data">Split</td>
                </tr>`
  );
  noSplit += 1;
  mstartTime = Date.now();
}

function resetStp() {
  stpTime = 0;
  mstpTime = 0;
  changeStopWatchDisplay("0", "0", "0", "0", "#stp-time");
  changeStopWatchDisplay("0", "0", "0", "0", "#millistp");
  clearInterval(stpWatchId);
  clearInterval(mstpWatchId);
}
