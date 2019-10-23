const rounds = {
  round1: {
    p1: [1, 5, 6, 5, 6, 4, 3, 6, 7, 9, 10],
    p2: [2, 6],
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
        if (row[player] !== 0) {
          tableHTML += `<td>${row[player]}</td>`;
        }
      });
      tableHTML += '</tr>';
    });

    $(`#${round}`).html(tableHTML);
  });
};

// Get the round score
const roundScore = (player, round) => {
  const playerKey = player === 1 ? 'p1' : 'p2';
  const score = rounds[round][playerKey].reduce((accumulator, value) => accumulator + value, 0);
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

// Roll dice
const onRoll = (min, max) => {
  const randomNumber = () => Math.floor(Math.random() * (max - min)) + min;
  const roll = { dice1: randomNumber(), dice2: randomNumber() };
  return roll;
};

const onPlay = (player) => {
  if (player === 1) {
    $('.player-1').addClass('animated bounceIn');
  } else if (player === 2) {
    $('.player-1').addClass('animated bounceIn');
    $('.player-2').addClass('animated bounceIn');
  }

  $('.player-control button').click(function () {
    const player = $(this).data('player');
    const action = $(this).data('action');
  });
};

$(document).ready(() => {
  $('.sign-play button').click(() => {
    $('#select-players-modal').modal();
  });

  $('.player').click(() => {
    const player = $(this).data('player');
    onPlay(player);

    // Hide play button after clicked
    $('.sign-play').hide();
    $.modal.close();
  });
});
