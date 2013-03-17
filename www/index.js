
(function(BRACKET) {

  BRACKET.defaultLocked = false;

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
      finalGame: oddsMin(2 * team.odds),
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
        BRACKET.selections.sweet16[regionName][spot16] = BRACKET.selections.sweet16[regionName][spot16] || { options: [], selected: undefined };
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
        BRACKET.selections.sweet16[regionName][spot16] = BRACKET.selections.sweet16[regionName][spot16] || { options: [], selected: undefined, locked: BRACKET.defaultLocked };
        seedMap[spot16].forEach(function(seed) {
          BRACKET.selections.sweet16[regionName][spot16].options.push({
            name: BRACKET.regions[regionName][seed],
            seed: seed
          });
        });
        BRACKET.selections.sweet16[regionName][spot16].selected = {
          name: BRACKET.regions[regionName][minSeed(seedMap[spot16])],
          seed: minSeed(seedMap[spot16])
        };
      });
    });
    //
    // elite8
    //
    BRACKET.selections.elite8 = BRACKET.selections.elite8 || {};
    ["East", "South", "Midwest", "West"].forEach(function(regionName) {
      var seeds;
      BRACKET.selections.elite8[regionName] = BRACKET.selections.elite8[regionName] || {};
      var region = BRACKET.regions[regionName];
      //
      // spot 1
      //
      BRACKET.selections.elite8[regionName]["1"] = BRACKET.selections.elite8[regionName]["1"] || { options: [], selected: undefined, locked: BRACKET.defaultLocked };
      BRACKET.selections.elite8[regionName]["1"].options = [
        BRACKET.selections.sweet16[regionName]["1"].selected,
        BRACKET.selections.sweet16[regionName]["2"].selected
      ];
      seeds = [
        BRACKET.selections.elite8[regionName]["1"].options[0].seed,
        BRACKET.selections.elite8[regionName]["1"].options[1].seed
      ];
      BRACKET.selections.elite8[regionName]["1"].selected = {
        name: BRACKET.regions[regionName][minSeed(seeds)],
        seed: minSeed(seeds)
      };
      //
      // spot 2
      //
      BRACKET.selections.elite8[regionName]["2"] = BRACKET.selections.elite8[regionName]["2"] || { options: [], selected: undefined, locked: BRACKET.defaultLocked };
      BRACKET.selections.elite8[regionName]["2"].options = [
        BRACKET.selections.sweet16[regionName]["3"].selected,
        BRACKET.selections.sweet16[regionName]["4"].selected
      ];
      seeds = [
        BRACKET.selections.elite8[regionName]["2"].options[0].seed,
        BRACKET.selections.elite8[regionName]["2"].options[1].seed
      ];
      BRACKET.selections.elite8[regionName]["2"].selected = {
        name: BRACKET.regions[regionName][minSeed(seeds)],
        seed: minSeed(seeds)
      };
    });

    //
    // final4
    //
    BRACKET.selections.final4 = BRACKET.selections.final4 || {};
    ["East", "South", "Midwest", "West"].forEach(function(regionName) {
      BRACKET.selections.final4[regionName] = BRACKET.selections.final4[regionName] || {};
      var region = BRACKET.regions[regionName];
      //
      BRACKET.selections.final4[regionName]["1"] = BRACKET.selections.final4[regionName]["1"] || { options: [], selected: undefined, locked: BRACKET.defaultLocked };
      BRACKET.selections.final4[regionName]["1"].options = [
        BRACKET.selections.elite8[regionName]["1"].selected,
        BRACKET.selections.elite8[regionName]["2"].selected
      ];
      var seeds = [
        BRACKET.selections.final4[regionName]["1"].options[0].seed,
        BRACKET.selections.final4[regionName]["1"].options[1].seed
      ];
      BRACKET.selections.final4[regionName]["1"].selected = {
        name: BRACKET.regions[regionName][minSeed(seeds)],
        seed: minSeed(seeds)
      };
    });

    //
    // finalGame
    //

    //
    // left
    //
    BRACKET.selections.finalGame = BRACKET.selections.finalGame || {};
    BRACKET.selections.finalGame.left = BRACKET.selections.finalGame.left || { options: [], selected: undefined, locked: BRACKET.defaultLocked };
    BRACKET.selections.finalGame.left.options = [
      BRACKET.selections.final4.Midwest["1"].selected,
      BRACKET.selections.final4.South["1"].selected
    ];
    BRACKET.selections.finalGame.left.selected = BRACKET.selections.finalGame.left.options[0];   // TODO: make non-arbitrary

    //
    // right
    //
    BRACKET.selections.finalGame = BRACKET.selections.finalGame || {};
    BRACKET.selections.finalGame.right = BRACKET.selections.finalGame.right || { options: [], selected: undefined, locked: BRACKET.defaultLocked };
    BRACKET.selections.finalGame.right.options = [
      BRACKET.selections.final4.West["1"].selected,
      BRACKET.selections.final4.East["1"].selected
    ];
    BRACKET.selections.finalGame.right.selected = BRACKET.selections.finalGame.right.options[0];   // TODO: make non-arbitrary


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
    ["sweet16", "elite8", "final4"].forEach(function(roundName) {
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
            entry = optionsEntry(spot.options, spot.selected);
          } else {
            entry = lockedEntry(spot.selected);
          }
          el.html(entry);
        }
      });
    });
    //
    // finalGame
    //
    var entry;
    var el;


    //
    //  left
    //
    el = $(".bracketLeft .finalGame .spot1");
    var left = BRACKET.selections.finalGame.left;
    if (!left.locked) {
      entry = optionsEntry(left.options, left.selected);
    } else {
      entry = lockedEntry(left.selected);
    }
    el.html(entry);

    //
    //  right
    // 
    el = $(".bracketRight .finalGame .spot1");
    var right = BRACKET.selections.finalGame.right;
    if (!right.locked) {
      entry = optionsEntry(right.options, right.selected);
    } else {
      entry = lockedEntry(right.selected);
    }
    el.html(entry);

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