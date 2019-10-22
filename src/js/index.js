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

// Get the total score
const totalScore = (player) => {
  const playerKey = player === 1 ? 'p1' : 'p2';
  const score = Object.keys(rounds).reduce((totalAccumulator, round) => {
    console.log(round);
    const roundScore = rounds[round][playerKey].reduce((accumulator, value) => accumulator + value, 0);
    return totalAccumulator + roundScore;
  }, 0);
  return score;
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

  $('.player').click(function () {
    const player = $(this).data('player');
    onPlay(player);

    // Hide play button after clicked
    $('.sign-play').hide();
    $.modal.close();
  });
});
