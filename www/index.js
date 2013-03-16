
(function(BRACKET) {

  var seeds = {
    1: [1, 16, 8, 9],
    2: [5, 12, 4, 13],
    3: [6, 11, 3, 14],
    4: [7, 10, 2, 15]
  };

  var oddsMin = function(odds) {
    return Math.min(odds, 0.98);
  };

  BRACKET.teamOdds = {};
  BRACKET.teams.forEach(function(team) {
    BRACKET.teamOdds[team.name] = {
      winner: team.odds,
      finals: oddsMin(2 * team.odds),
      final4: oddsMin(4 * team.odds),
      elite8: oddsMin(8 * team.odds),
      sweet16: oddsMin(16 * team.odds)
    };
  });

  BRACKET.selections = BRACKET.selections || {};

  var reset = function() {
    BRACKET.selections = {};
    for (var regionName in BRACKET.regions) {
      region = BRACKET.regions[regionName];
      BRACKET.selections[regionName] = BRACKET.selections[regionName] || {};
      BRACKET.selections[regionName].sweet16 = BRACKET.selections[regionName].sweet16 || {};
      ["1", "2", "3", "4"].forEach(function(spot16) {
        BRACKET.selections[regionName].sweet16[spot16] = BRACKET.selections[regionName].sweet16[spot16] || { options: [], selection: undefined };
        seeds[spot16].forEach(function(seed) {
          BRACKET.selections[regionName].sweet16[spot16].options.push({
            name: BRACKET.regions[regionName][seed],
            seed: seed
          });
        });
      });
    }
  };

  var render = function() {
    for (var regionName in BRACKET.selections) {
      var region = BRACKET.selections[regionName]
      for (var round in region) {
        
      }
    }
    BRACKET.selections.
    $(".sweet16 .east .spot1")[0]
  };

  var ready = function() {
    var region;
    var selections = {};
    // TODO: check local storage
    reset();
  };

  $(ready);

})(BRACKET);