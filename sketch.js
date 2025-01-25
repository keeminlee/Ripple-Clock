let canvasWidth = 1000;
let canvasHeight = 1000;


let secondRipples = [];
let minuteRipples = [];
let hourRipples = [];

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  noFill();
  strokeWeight(0.5);


  initializeSecondRipples();
  initializeMinuteRipples();
  initializeHourRipples();
}

function draw() {
  background(20, 30, 50);

  // Get the current time
  let now = new Date();
  let currentSecond = now.getSeconds();
  let currentMinute = now.getMinutes();
  let currentHour = now.getHours();
  let millisFraction = now.getMilliseconds() / 1000; // Fractional part of the current second
  let totalElapsedSeconds = currentSecond + millisFraction; // Smooth fractional second value
  let totalElapsedMinutes = currentMinute + totalElapsedSeconds / 60; // Smooth fractional minute value
  let totalElapsedHours = currentHour + totalElapsedMinutes / 60; // Smooth fractional hour value (24-hour clock)

  translate(width / 2, height / 2);

  // fixed boundary circles
  drawBoundaryCircles();

  if (!secondRipples.some((ripple) => ripple.timeUnit === currentSecond)) {
    secondRipples.push(new Ripple(currentSecond, 60, width / 6, color(100, 200, 255))); // Add seconds ripple
  }

  // Add a new minute ripple if it doesn't already exist
  if (!minuteRipples.some((ripple) => ripple.timeUnit === currentMinute)) {
    minuteRipples.push(new Ripple(currentMinute, 60, width / 3, color(150, 255, 150), width / 6)); // Add minutes ripple
  }

  // Add a new hour ripple if it doesn't already exist
  if (!hourRipples.some((ripple) => ripple.timeUnit === currentHour)) {
    hourRipples.push(new Ripple(currentHour, 24, width / 2, color(255, 150, 150), width / 3)); // Add hours ripple
  }

  // Draw and update second ripples
  for (let ripple of secondRipples) {
    ripple.draw(totalElapsedSeconds, millisFraction); // Brightness scales with seconds
  }
  secondRipples = secondRipples.filter((ripple) => !ripple.isFinished(totalElapsedSeconds)); // Remove finished ripples

  // Draw and update minute ripples
  for (let ripple of minuteRipples) {
    let minuteProgressFraction = (totalElapsedMinutes % 1); // Fractional progress for the current minute
    ripple.draw(totalElapsedMinutes, 1 - minuteProgressFraction); // Brightness scales with minutes
  }
  minuteRipples = minuteRipples.filter((ripple) => !ripple.isFinished(totalElapsedMinutes)); // Remove finished ripples

  // Draw and update hour ripples
  for (let ripple of hourRipples) {
    let hourProgressFraction = (totalElapsedHours % 1); // Fractional progress for the current hour
    ripple.draw(totalElapsedHours, 1 - hourProgressFraction); // Brightness scales with hours
  }
  hourRipples = hourRipples.filter((ripple) => !ripple.isFinished(totalElapsedHours)); // Remove finished ripples
}

// Ripple class to manage individual ripples
class Ripple {
  constructor(timeUnit, totalUnits, maxRadius, col, initialRadius = 0) {
    this.timeUnit = timeUnit; // unit of time this ripple represents (0-59 for seconds/minutes, 0-23 for hours)
    this.totalUnits = totalUnits; // Total duration of the ripple (60 seconds, 60 minutes, or 24 hours)
    this.maxRadius = maxRadius;
    this.initialRadius = initialRadius;
    this.col = col; //
  }

  // Draw the ripple with brightness scaling
  draw(totalElapsedUnits, brightnessFactor) {
    let progress = (totalElapsedUnits - this.timeUnit) / (this.totalUnits - this.timeUnit); // 

    if (progress >= 0 && progress <= 1) {
      let scaledBrightness = map(brightnessFactor, 0, 1, 255, 50);
      let currentColor = color(
        red(this.col),
        green(this.col),
        blue(this.col),
        scaledBrightness
      );

      stroke(currentColor);
      let currentRadius = this.initialRadius + (this.maxRadius - this.initialRadius) * progress; // Scale ripple size
      ellipse(0, 0, currentRadius * 2, currentRadius * 2);
    }
  }


  isFinished(totalElapsedUnits) {
    return totalElapsedUnits >= this.totalUnits; // Ripple is finished if its cycle is complete
  }
}


function drawBoundaryCircles() {
  stroke(255, 255, 255, 255);
  strokeWeight(3);
  ellipse(0, 0, width / 6 * 2, width / 6 * 2);
  ellipse(0, 0, width / 3 * 2, width / 3 * 2);
  strokeWeight(0.5);
}


function initializeSecondRipples() {
  let now = new Date();
  let currentSecond = now.getSeconds();
  let millisFraction = now.getMilliseconds() / 1000;
  let totalElapsedSeconds = currentSecond + millisFraction;

  for (let i = 0; i <= currentSecond; i++) {
    secondRipples.push(new Ripple(i, 60, width / 6, color(100, 200, 255)));
  }
}

function initializeMinuteRipples() {
  let now = new Date();
  let currentMinute = now.getMinutes();
  let currentSecond = now.getSeconds();
  let millisFraction = now.getMilliseconds() / 1000;
  let totalElapsedMinutes = currentMinute + (currentSecond + millisFraction) / 60;

  for (let i = 0; i <= currentMinute; i++) {
    minuteRipples.push(new Ripple(i, 60, width / 3, color(150, 255, 150), width / 6));
  }
}

function initializeHourRipples() {
  let now = new Date();
  let currentHour = now.getHours();
  let currentMinute = now.getMinutes();
  let currentSecond = now.getSeconds();
  let millisFraction = now.getMilliseconds() / 1000;
  let totalElapsedHours = currentHour + (currentMinute + currentSecond / 60 + millisFraction) / 60;


  for (let i = 0; i <= currentHour; i++) {
    hourRipples.push(new Ripple(i, 24, width / 2, color(255, 150, 150), width / 3)); // Hours ripple grows to width / 2
  }
}
