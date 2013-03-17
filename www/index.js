
(function(BRACKET) {

  BRACKET.poolSize = BRACKET.poolSize || 10;

  var seedMap = {
    1: [1, 16, 8, 9],
    2: [5, 12, 4, 13],
    3: [6, 11, 3, 14],
    4: [7, 10, 2, 15]
  };

  var spotMap = {
    sweet16: 4,
    elite8: 2,
    final4: 1
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

  var old_resetSelections = function() {
    BRACKET.selections = {};
    for (var regionName in BRACKET.regions) {
      region = BRACKET.regions[regionName];
      BRACKET.selections.sweet16 = BRACKET.selections.sweet16 || {};
      BRACKET.selections.sweet16[regionName] = BRACKET.selections.sweet16[regionName] || {};
      ["1", "2", "3", "4"].forEach(function(spot16) {
        BRACKET.selections.sweet16[regionName][spot16] = BRACKET.selections.sweet16[regionName][spot16] || { options: [], selection: undefined };
        seedMap[spot16].forEach(function(seed) {
          BRACKET.selections.sweet16[regionName][spot16].options.push({
            name: BRACKET.regions[regionName][seed],
            seed: seed
          });
        });
      });
    }
  };

  var minSeed = function(seeds) {
    var min;
    seeds.forEach(function(seed) {
      min = min || seed;
      if (seed < min) {
        min = seed;
      }
    });
    return min;
  };

  var resetSelections = function() {
    BRACKET.selections = {};
    //
    // sweet16
    //
    BRACKET.selections.sweet16 = BRACKET.selections.sweet16 || {};
    ["East", "South", "Midwest", "West"].forEach(function(regionName) {
      BRACKET.selections.sweet16[regionName] = BRACKET.selections.sweet16[regionName] || {};
      var region = BRACKET.regions[regionName];
      ["1", "2", "3", "4"].forEach(function(spot16) {
        BRACKET.selections.sweet16[regionName][spot16] = BRACKET.selections.sweet16[regionName][spot16] || { options: [], selection: undefined };
        seedMap[spot16].forEach(function(seed) {
          BRACKET.selections.sweet16[regionName][spot16].options.push({
            name: BRACKET.regions[regionName][seed],
            seed: seed
          });
        });
        BRACKET.selections.sweet16[regionName][spot16].selection = {
          name: BRACKET.regions[regionName][minSeed(seedMap[spot16])],
          seed: minSeed(seedMap[spot16])
        };
        BRACKET.selections.sweet16[regionName][spot16].locked = true;
      });
    });
  };


  var optionsEntry = function(options, selected) {
    var selectedName;
    if (selected) {
      selectedName = selected.name;
    }
    var html = '<select class="entry options">';
    options.forEach(function(option) {
      html = html + '<option value="' + option.name + '"';
      if (option.name === selectedName) {
        html = html + ' selected ';
      }
      html = html + '>' + option.name + ' (' + option.seed + ')</option>';
    });
    html = html + '</select>';
    return html;
  };


  var lockedEntry = function(team) {
    return '<div class="entry locked">' + team.name + ' (' + team.seed + ')</div>';
  };

  var render = function() {
    ["sweet16"].forEach(function(roundName) {
      var round = BRACKET.selections[roundName];
      ["East", "South", "Midwest", "West"].forEach(function(regionName) {
        var region = round[regionName];
        var el;
        var spot;
        var entry;
        for (var spotName in region) {
          spot = region[spotName];
          el = $("." + roundName + " ." + regionName + " .spot" + spotName);
          if (!spot.locked) {
            entry = optionsEntry(spot.options, spot.selection);
          } else {
            entry = lockedEntry(spot.selection);
          }
          el.html(entry);
        }
      });
    });
        //        console.log($(".sweet16 .east .spot1")[0]);
  };

  var ready = function() {
    var region;
    var selections = {};
    // TODO: check local storage
    resetSelections();
    render();
  };

  $(ready);

})(BRACKET);