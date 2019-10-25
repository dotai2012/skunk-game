// Toasty options
const toast = new Toasty({
  enableSounds: true,
  sounds: {
    info: './sounds/info/1.mp3',
    success: './sounds/success/1.mp3',
    warning: './sounds/warning/1.mp3',
    error: './sounds/error/1.mp3',
  },
});

// Modal options
$.modal.defaults = {
  escapeClose: false, // Allows the user to close the modal by pressing `ESC`
  clickClose: false, // Allows the user to close the modal by clicking the overlay
  closeText: 'Close', // Text content for the close <a> tag.
  closeClass: '', // Add additional class(es) to the close <a> tag.
  showClose: true,
};

let isP1Playing = true;
let isP2Playing = true;
let isPlayWithBot = false;

let currentRound = 1;

const rounds = {
  round1: {
    p1: [],
    p2: [],
  },
  round2: {
    p1: [],
    p2: [],
  },
  round3: {
    p1: [],
    p2: [],
  },
  round4: {
    p1: [],
    p2: [],
  },
  round5: {
    p1: [],
    p2: [],
  },
};

// Get the round score
const roundScore = (player, round) => {
  const playerKey = player === 1 ? 'p1' : 'p2';
  const playerArrayScore = rounds[round][playerKey];
  const score = playerArrayScore.findIndex(value => value === 0) !== -1 ? 0 : playerArrayScore.reduce((accumulator, value) => accumulator + value, 0);
  return score;
};

// Get the total score
const totalScore = (player) => {
  const total = Object.keys(rounds).reduce((totalAccumulator, round) => {
    const score = roundScore(player, round);
    return totalAccumulator + score;
  }, 0);
  return total;
};

// If both 2 players decide to stop, then move to the next round
const checkRound = (condition) => {
  if (condition) {
    if (currentRound < 5) {
      currentRound += 1;
      isP1Playing = true;
      isP2Playing = true;

      if (isPlayWithBot) {
        $('#stop-player-1').show();
      } else {
        $('#stop-player-1').show();
        $('#stop-player-2').show();
      }
    } else {
      (new Audio('./sounds/success/2.mp3')).play();

      const player1Score = totalScore(1);
      const player2Score = totalScore(2);

      $('#show-winner .modal-content .winner').html(`<p>Score Player 1: ${player1Score}</p>
      <p>Score Player 2: ${player2Score}</p>
      <h2>The winner is Player ${player1Score > player2Score ? 1 : 2}</h2>
      `);
      $('#show-winner').modal();
    }
  }
};

// Display score to the table
const displayTableScore = () => {
  Object.keys(rounds).map((round) => {
    const player1 = rounds[round].p1;
    const player2 = rounds[round].p2;
    const loopLength = player1.length > player2.length ? player1.length : player2.length;

    const tableData = [];
    for (let index = 0; index < loopLength; index++) {
      const rowData = { p1: player1[index] || 0, p2: player2[index] || 0 };
      tableData.push(rowData);
    }

    let tableHTML = '';
    // Slice(-15) mean show last 15 results
    tableData.slice(-15).map((row) => {
      tableHTML += '<tr>';
      Object.keys(row).map((player) => {
        tableHTML += `<td>${row[player]}</td>`;
      });
      tableHTML += '</tr>';
    });

    $(`#${round}`).html(tableHTML);

    // Total score
    const player1CurrentRoundScore = roundScore(1, round);
    const player2CurrentRoundScore = roundScore(2, round);

    $(`#${round}-total`).html(`<td>${player1CurrentRoundScore}</td><td>${player2CurrentRoundScore}</td>`);
  });
};

// Roll dice
const randomDice = (min, max) => {
  const randomNumber = () => Math.floor(Math.random() * (max - min)) + min;
  const roll = { dice1: randomNumber(), dice2: randomNumber() };
  return roll;
};

const onRoll = () => {
  const { dice1, dice2 } = randomDice(1, 6);
  let sum = dice1 + dice2;

  // dice1 = 1 and dice2 not 1
  // dice1 not 1 and dice2 = 1
  if(dice1 === 1 || dice2 === 1){
    if(isP1Playing && isP2Playing){
      sum = dice1 + dice2;
    } else {
      sum = 0;
    }
  } 

  // Simple AI for the bot
  if (isPlayWithBot) {
    const currentRoundScoreP1 = roundScore(1, `round${currentRound}`);
    const currentRoundScoreP2 = roundScore(2, `round${currentRound}`);

    if (currentRoundScoreP2 > currentRoundScoreP1) {
      isP2Playing = false;

      toast.info('The bot choose to stop this round');

      checkRound(!isP1Playing && !isP2Playing);
      return sum;
    }
  }

  if (isP1Playing) {
    rounds[`round${currentRound}`].p1.push(sum);
  }

  if (isP2Playing) {
    rounds[`round${currentRound}`].p2.push(sum);
  }

  const isHaveDiceOnePointAndOnePlayerStop = (dice1 === 1 || dice2 === 1) && (!isP1Playing || !isP2Playing);

  checkRound(isHaveDiceOnePointAndOnePlayerStop);

  $('#box-1').text(dice1);
  $('#box-2').text(dice2);

  return sum;
};

const onPlay = (numberOfPlayer) => {
  $('.player-control').css('display', 'flex');

  if (numberOfPlayer === 1) {
    isPlayWithBot = true;
    $('#stop-player-1').show().addClass('animated bounceIn');
  } else if (numberOfPlayer === 2) {
    $('#stop-player-1').show().addClass('animated bounceIn');
    $('#stop-player-2').show().addClass('animated bounceIn');
  }
};

// Handle buttons
$('#roll').click(() => {
  (new Audio('./sounds/info/1.mp3')).play();

  onRoll();
  displayTableScore();
});

$('#stop-player-1').click(function () {
  (new Audio('./sounds/info/2.mp3')).play();

  $(this).hide();

  isP1Playing = false;

  toast.info('Player 1 choose to stop this round');

  checkRound(!isP1Playing && !isP2Playing);
});

$('#stop-player-2').click(function () {
  (new Audio('./sounds/info/2.mp3')).play();

  $(this).hide();

  isP2Playing = false;

  toast.info('Player 2 choose to stop this round');

  checkRound(!isP1Playing && !isP2Playing);
});

// Restart game
const onRestart = () => {
  isP1Playing = true;
  isP2Playing = true;
  isPlayWithBot = false;

  currentRound = 1;

  Object.keys(rounds).map((round) => {
    rounds[round] = {
      p1: [],
      p2: [],
    };
  });
  displayTableScore();

  // Hide dice
  $('.dice').hide();
  $('#box-1').text('');
  $('#box-2').text('');

  $('.sign-play').show();
  $('.player-control').hide();
};

$('#show-winner').on($.modal.BEFORE_CLOSE, onRestart);
$('.play-again').click(() => {
  $.modal.close();
  onRestart();
});

$(document).ready(() => {
  $('.sign-play button').click(() => {
    $('#select-players-modal').modal();
  });

  $('.player').click(function () {
    const player = $(this).data('player');
    onPlay(player);

    // Hide play button after clicked
    $('.sign-play').hide();
    $.modal.close();

    // Show dice
    $('.dice').css('display', 'flex');
  });
});
