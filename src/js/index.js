$.modal.defaults = {
  escapeClose: false, // Allows the user to close the modal by pressing `ESC`
  clickClose: false, // Allows the user to close the modal by clicking the overlay
  closeText: 'Close', // Text content for the close <a> tag.
  closeClass: '', // Add additional class(es) to the close <a> tag.
  showClose: true,
};

let isP1Playing = true;
let isP2Playing = true;

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
    } else {
      $('#show-winner .modal-content').html(`<p>Score Player 1: ${totalScore(1)}</p><p>Score Player 2: ${totalScore(2)}</p>`);
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
    tableData.map((row) => {
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
  const { dice1, dice2 } = randomDice(1, 10);
  const sum = dice1 !== 1 && dice2 !== 1 ? dice1 + dice2 : 0;

  if (isP1Playing) {
    rounds[`round${currentRound}`].p1.push(sum);
  }

  if (isP2Playing) {
    rounds[`round${currentRound}`].p2.push(sum);
  }

  const isHaveDiceOnePoint = dice1 === 1 || dice2 === 1;

  checkRound(isHaveDiceOnePoint);

  $('#box-1').text(dice1);
  $('#box-2').text(dice2);

  return sum;
};

const onPlay = (numberOfPlayer) => {
  $('.player-control').css('display', 'flex');

  if (numberOfPlayer === 1) {
    $('#player-1').show().addClass('animated bounceIn');
  } else if (numberOfPlayer === 2) {
    $('#player-1').show().addClass('animated bounceIn');
    $('#player-2').show().addClass('animated bounceIn');
  }

  $('#roll').click(() => {
    onRoll();
    displayTableScore();
  });

  $('#stop-player-1').click(() => {
    isP1Playing = false;
    checkRound(!isP1Playing && !isP2Playing);
  });

  $('#stop-player-2').click(() => {
    isP2Playing = false;
    checkRound(!isP1Playing && !isP2Playing);
  });
};

// Restart game
const onRestart = () => {
  isP1Playing = true;
  isP2Playing = true;
  currentRound = 1;

  Object.keys(rounds).map((round) => {
    rounds[round] = {
      p1: [],
      p2: [],
    };
  });
  displayTableScore();

  $('#box-1').text('');
  $('#box-2').text('');
};

$('#show-winner').on($.modal.BEFORE_CLOSE, onRestart);


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
  });
});
