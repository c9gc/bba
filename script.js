// Game variables
var goatHealth = 100;
var zombieHealth = 100;
var isButtonDisabled = false;

// DOM elements
var goatHealthElement = document.getElementById("goat-health");
var goatHealthBarElement = document.getElementById("goat-health-bar");
var goatImageElement = document.getElementsByClassName("goat-image")[0];
var goatMessageElement = document.getElementById("goat-message");
var goatAttackButton = document.getElementById("goatAttackButton");

var zombieHealthElement = document.getElementById("zombie-health");
var zombieHealthBarElement = document.getElementById("zombie-health-bar");
var zombieImageElement = document.getElementsByClassName("goat-image")[1];
var zombieMessageElement = document.getElementById("zombie-message");

// Attack objects
// Goat's attacks
var goatAttacks = [{
    name: "BAAA Strike",
    power: 5,
    accuracy: 0.9,
    description: "Unleashes a powerful BAAA strike."
  },
  {
    name: "Head Butt",
    power: 3,
    accuracy: 0.8,
    description: "Charges forward and headbutts opponent."
  },
  {
    name: "Horn Blade",
    power: 9,
    accuracy: 0.4,
    description: "Slashes with sharp and pointy horns."
  },
  {
    name: "Milk Jet",
    power: 7,
    accuracy: 0.9,
    description: "Rushes with a high-speed milk jet."
  },
  {
    name: "Horn Slam",
    power: 15,
    accuracy: 0.5,
    description: "Picks up opponent with horns and throws them in the air."
  }
];

// Zombie's attacks
var zombieAttacks = [{
    name: "Bite",
    power: 3,
    accuracy: 0.9,
    description: "Stuns opponent with toxic zombie bite."
  },
  {
    name: "Zombie Puke",
    power: 9,
    accuracy: 0.4,
    description: "Spits poisonous vomit on opponent."
  },
  {
    name: "Hoof Stomp",
    power: 5,
    accuracy: 0.7,
    description: "Stomps the opponent with strong hooves."
  },
  {
    name: "Milk Gun",
    power: 15,
    accuracy: 0.5,
    description: "Shoots acidic spoiled milk at the opponent."
  },
  {
    name: "Tackle",
    power: 6,
    accuracy: 0.9,
    description: "Charges forward to tackle the opponent."
  }
];

// Update goat image opacity based on goat health
function updateGoatImageOpacity() {
  var opacity = goatHealth / 100; // Adjust opacity based on goat health
  goatImageElement.style.opacity = opacity.toFixed(2); // Set opacity value

  // Add flashing effect if health is below 50%
  if (goatHealth < 50) {
    goatImageElement.classList.add("flash");
  } else {
    goatImageElement.classList.remove("flash");
  }

  // Reset opacity to 1 for loser image
  if (goatHealth <= 0) {
    goatImageElement.classList.add("loser-image");
    goatImageElement.style.opacity = "1";
  } else {
    goatImageElement.classList.remove("loser-image");
  }
}

// Update zombie image opacity based on zombie health
function updateZombieImageOpacity() {
  var opacity = zombieHealth / 100; // Adjust opacity based on zombie health
  zombieImageElement.style.opacity = opacity.toFixed(2); // Set opacity value

  // Add flashing effect if health is below 50%
  if (zombieHealth < 50) {
    zombieImageElement.classList.add("flash");
  } else {
    zombieImageElement.classList.remove("flash");
  }

  // Reset opacity to 1 for loser image
  if (zombieHealth <= 0) {
    zombieImageElement.classList.add("loser-image");
    zombieImageElement.style.opacity = "1";
  } else {
    zombieImageElement.classList.remove("loser-image");
  }
}

// Function to update health text and health bar
function updateHealth(character, healthElement, healthBarElement) {
  healthElement.textContent = "Health: " + character.health;
  healthBarElement.style.width = character.health + "%";
  updateGoatImageOpacity(); // Update goat image opacity when health changes
  updateZombieImageOpacity(); // Update zombie image opacity when health changes
}

// Function to update the message bubble
function updateMessageBubble(messageElement, message) {
  messageElement.textContent = message;
}

// Function to get a random attack from the attacks array
function getRandomAttack(attacks) {
  var randomIndex = Math.floor(Math.random() * attacks.length);
  return attacks[randomIndex];
}

// Function to check if the battle is over
function isBattleOver() {
  return goatHealth <= 0 || zombieHealth <= 0;
}

// Function to end the battle and display the result
function endBattle() {
  goatAttackButton.disabled = true;

  // Show the restart button
  var restartButton = document.getElementById("restartButton");
  restartButton.style.display = "block";

  if (goatHealth <= 0 && zombieHealth <= 0) {
    updateMessageBubble(goatMessageElement, "It's a draw!");
    updateMessageBubble(zombieMessageElement, "It's a draw!");
  } else if (goatHealth <= 0) {
    updateMessageBubble(goatMessageElement, "YOU LOSE!");
    updateMessageBubble(zombieMessageElement, "Zombie wins!");
    goatImageElement.classList.add("loser-image");
    goatImageElement.classList.remove("shake"); // Remove the shaking animation
    goatImageElement.classList.remove("flash"); // Remove the flashing animation

    // Delay changing the image to "rip.png" by 2 seconds
    setTimeout(function() {
      goatImageElement.src = "rip.png";
      goatImageElement.classList.add("spin");
    }, 1000);
  } else {
    updateMessageBubble(goatMessageElement, "YOU WIN!");
    updateMessageBubble(zombieMessageElement, "Zombie is defeated!");
    zombieImageElement.classList.add("loser-image");
    zombieImageElement.classList.remove("shake"); // Remove the shaking animation
    zombieImageElement.classList.remove("flash"); // Remove the flashing animation

    // Delay changing the image to "rip.png" by 2 seconds
    setTimeout(function() {
      zombieImageElement.src = "rip.png";
      zombieImageElement.classList.add("spin");
    }, 1000);
  }
}

// Handles the goat's attack
function goatAttack(attackIndex) {
  if (isButtonDisabled) return; // Prevent button spamming
  isButtonDisabled = true; // Disable the button

  var attack = goatAttacks[attackIndex];

  // Check if the attack hits
  var attackHits = Math.random() <= attack.accuracy;

  if (attackHits) {
    zombieHealth -= attack.power;
    if (zombieHealth < 0) {
      zombieHealth = 0; // Set the minimum value as 0
    }
    updateHealth({ health: zombieHealth }, zombieHealthElement, zombieHealthBarElement);
    updateMessageBubble(goatMessageElement, "Goat uses " + attack.name + "! " + attack.description);
    updateMessageBubble(zombieMessageElement, "Zombie takes " + attack.power + " damage!");

    // Shake the zombie image
    zombieImageElement.classList.add("shake");

    // Remove the shake effect after 1 second
    setTimeout(function() {
      zombieImageElement.classList.remove("shake");
    }, 1000);
  } else {
    updateMessageBubble(goatMessageElement, "Goat's attack missed!");
    updateMessageBubble(zombieMessageElement, "Zombie dodged the attack!");
  }

  // Check if the battle is over
  if (isBattleOver()) {
    endBattle();
  } else {
    setTimeout(zombieAttack, 1000);
  }

  // Enable the button for the next attack after a cooldown period
  setTimeout(function() {
    isButtonDisabled = false;
  }, 3000); // 3-second cooldown before the button becomes enabled again
}

// Handles the zombie's attack
function zombieAttack() {
  var attack = getRandomAttack(zombieAttacks);

  // Check if the attack hits
  var attackHits = Math.random() <= attack.accuracy;

  if (attackHits) {
    goatHealth -= attack.power;
    if (goatHealth < 0) {
      goatHealth = 0; // Set the minimum value as 0
    }
    updateHealth({
      health: goatHealth
    }, goatHealthElement, goatHealthBarElement);
    updateMessageBubble(zombieMessageElement, "Zombie uses " + attack.name + "! " + attack.description);
    updateMessageBubble(goatMessageElement, "Goat takes " + attack.power + " damage!");

    // Shake the goat image
    goatImageElement.classList.add("shake");

    // Remove the shake effect after 1 second
    setTimeout(function() {
      goatImageElement.classList.remove("shake");
    }, 1000);
  } else {
    updateMessageBubble(zombieMessageElement, "Zombie's attack missed!");
    updateMessageBubble(goatMessageElement, "Goat dodged the attack!");
  }

  // Check if the battle is over
  if (isBattleOver()) {
    endBattle();
  }
}

// Function to reset the game state
function resetGame() {
  // Reset goat and zombie health
  goatHealth = 100;
  zombieHealth = 100;

  // Reset goat and zombie health elements
  updateHealth({
    health: goatHealth
  }, goatHealthElement, goatHealthBarElement);
  updateHealth({
    health: zombieHealth
  }, zombieHealthElement, zombieHealthBarElement);

  // Reset message bubbles
  updateMessageBubble(goatMessageElement, "");
  updateMessageBubble(zombieMessageElement, "");

  // Reset goat and zombie images
  goatImageElement.src = "goat.png";
  goatImageElement.classList.remove("loser-image");
  goatImageElement.classList.remove("spin");
  goatImageElement.classList.remove("shake");
  goatImageElement.classList.remove("flash");

  zombieImageElement.src = "zombie.png";
  zombieImageElement.classList.remove("loser-image");
  zombieImageElement.classList.remove("spin");
  zombieImageElement.classList.remove("shake");
  zombieImageElement.classList.remove("flash");

  // Enable the goat attack button
  goatAttackButton.disabled = false;

  // Hide the restart button
  var restartButton = document.getElementById("restartButton");
  restartButton.style.display = "none";
}

// Event listener for the restart button
var restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", resetGame);

// Attach event listener to the goat's attack button
goatAttackButton.addEventListener("click", function() {
  goatAttackButton.disabled = true;
  goatAttack(selectAttack.selectedIndex);
});

// Create the select element for choosing the goat's attack
var selectAttack = document.createElement("select");
selectAttack.id = "goat-attack-select";

// Create and append the option elements for each attack
for (var i = 0; i < goatAttacks.length; i++) {
  var option = document.createElement("option");
  option.value = i;
  option.text = goatAttacks[i].name;
  selectAttack.appendChild(option);
}

// Append the select element to the goat's attack button container
document.getElementById("goat-attack-button-container").appendChild(selectAttack);

// Initialize the game state
resetGame();
