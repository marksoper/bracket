
(function(BRACKET) {

  BRACKET.poolSize = BRACKET.poolSize || 10;

  var seedMap = {
    1: [1, 16, 8, 9],
    2: [5, 12, 4, 13],
    3: [6, 11, 3, 14],
    4: [7, 10, 2, 15]
  };

  BRACKET.score = function(round, seed) {
    if (round === "sweet16") {
      return 4;
    } else if (round === "elite8") {
      return 8;
    } else if (round === "final4") {
      return 16;
    } else if (round === "finalGame") {
      return 32;
    }
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
      seed: team.seed,
      region: team.region,
      winner: team.odds,
      finalGame: oddsMin(2 * team.odds),
      final4: oddsMin(4 * team.odds),
      elite8: oddsMin(8 * team.odds),
      sweet16: oddsMin(16 * team.odds)
    };
  });

  BRACKET.selections = BRACKET.selections || {};

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

  var pickNames = function(arrObjs) {
    var arrStrs = [];
    arrObjs.forEach(function(obj) {
      arrStrs.push(obj.name);
    });
    return arrStrs;
  };

  var initOptions = function() {
    console.log("initOptions called");

    BRACKET.yourScore = {
      games: 0,
      points: 0
    };

    BRACKET.selections = BRACKET.selections || {};

    //
    // sweet16
    //
    BRACKET.selections.sweet16 = BRACKET.selections.sweet16 || {};
    ["Midwest", "South", "West", "East"].forEach(function(regionName) {
      BRACKET.selections.sweet16[regionName] = BRACKET.selections.sweet16[regionName] || {};
      var region = BRACKET.regions[regionName];
      ["1", "2", "3", "4"].forEach(function(spot16) {
        BRACKET.selections.sweet16[regionName][spot16] = BRACKET.selections.sweet16[regionName][spot16] || { options: [], selected: undefined, manual: false };
        if (BRACKET.selections.sweet16[regionName][spot16].options.length === 0) {
          seedMap[spot16].forEach(function(seed) {
            BRACKET.selections.sweet16[regionName][spot16].options.push({
              name: BRACKET.regions[regionName][seed],
              seed: seed
            });
          });
        }
        if (!BRACKET.selections.sweet16[regionName][spot16].manual) {
          // auto-optimize
          BRACKET.selections.sweet16[regionName][spot16].selected = {
            name: BRACKET.regions[regionName][minSeed(seedMap[spot16])],
            seed: minSeed(seedMap[spot16])
          };
        }
        BRACKET.yourScore.games += 1;
        BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.sweet16[regionName][spot16].selected.name].sweet16 * BRACKET.score("sweet16", BRACKET.selections.sweet16[regionName][spot16].selected.seed);
      });
    });

    //
    // elite8
    //
    BRACKET.selections.elite8 = BRACKET.selections.elite8 || {};
    ["Midwest", "South", "West", "East"].forEach(function(regionName) {
      var seeds;
      BRACKET.selections.elite8[regionName] = BRACKET.selections.elite8[regionName] || {};
      var region = BRACKET.regions[regionName];
      //
      // spot 1
      //
      BRACKET.selections.elite8[regionName]["1"] = BRACKET.selections.elite8[regionName]["1"] || { options: [], selected: undefined, manual: false };
      BRACKET.selections.elite8[regionName]["1"].options = [
        BRACKET.selections.sweet16[regionName]["1"].selected,
        BRACKET.selections.sweet16[regionName]["2"].selected
      ];
      if (!BRACKET.selections.elite8[regionName]["1"].manual) {
        // auto-optimize
        seeds = [
          BRACKET.selections.elite8[regionName]["1"].options[0].seed,
          BRACKET.selections.elite8[regionName]["1"].options[1].seed
        ];
        BRACKET.selections.elite8[regionName]["1"].selected = {
          name: BRACKET.regions[regionName][minSeed(seeds)],
          seed: minSeed(seeds)
        };
      }
      //
      //
      //
      BRACKET.yourScore.games += 1;
      BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["1"].selected.name].elite8 * BRACKET.score("elite8", BRACKET.selections.elite8[regionName]["1"].selected.seed);
      //
      // spot 2
      //
      BRACKET.selections.elite8[regionName]["2"] = BRACKET.selections.elite8[regionName]["2"] || { options: [], selected: undefined, manual: false };
      BRACKET.selections.elite8[regionName]["2"].options = [
        BRACKET.selections.sweet16[regionName]["3"].selected,
        BRACKET.selections.sweet16[regionName]["4"].selected
      ];
      if (!BRACKET.selections.elite8[regionName]["2"].manual) {
        // auto-optimize
        seeds = [
          BRACKET.selections.elite8[regionName]["2"].options[0].seed,
          BRACKET.selections.elite8[regionName]["2"].options[1].seed
        ];
        BRACKET.selections.elite8[regionName]["2"].selected = {
          name: BRACKET.regions[regionName][minSeed(seeds)],
          seed: minSeed(seeds)
        };
      }
      //
      //
      //
      BRACKET.yourScore.games += 1;
      BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["2"].selected.name].elite8 * BRACKET.score("elite8", BRACKET.selections.elite8[regionName]["2"].selected.seed);
    });

    //
    // final4
    //
    BRACKET.selections.final4 = BRACKET.selections.final4 || {};
    ["Midwest", "South", "West", "East"].forEach(function(regionName) {
      BRACKET.selections.final4[regionName] = BRACKET.selections.final4[regionName] || {};
      var region = BRACKET.regions[regionName];
      //
      BRACKET.selections.final4[regionName]["1"] = BRACKET.selections.final4[regionName]["1"] || { options: [], selected: undefined, manual: false };
      BRACKET.selections.final4[regionName]["1"].options = [
        BRACKET.selections.elite8[regionName]["1"].selected,
        BRACKET.selections.elite8[regionName]["2"].selected
      ];

      if (!BRACKET.selections.final4[regionName]["1"].manual || pickNames(BRACKET.selections.final4[regionName]["1"].options).indexOf(BRACKET.selections.final4[regionName]["1"].selected.name) < 0) {
        // auto-optimize
        var seeds = [
          BRACKET.selections.final4[regionName]["1"].options[0].seed,
          BRACKET.selections.final4[regionName]["1"].options[1].seed
        ];
        BRACKET.selections.final4[regionName]["1"].selected = {
          name: BRACKET.regions[regionName][minSeed(seeds)],
          seed: minSeed(seeds)
        };
      }
    });


    //
    // finalGame
    //

    //
    // left
    //
    BRACKET.selections.finalGame = BRACKET.selections.finalGame || {};
    BRACKET.selections.finalGame.left = BRACKET.selections.finalGame.left || { options: [], selected: undefined, manual: false };
    BRACKET.selections.finalGame.left.options = [
      BRACKET.selections.final4.Midwest["1"].selected,
      BRACKET.selections.final4.South["1"].selected
    ];
    if (!BRACKET.selections.finalGame.left.manual || pickNames(BRACKET.selections.finalGame.left.options).indexOf(BRACKET.selections.finalGame.left.selected.name) < 0) {
      // auto-optimize
      BRACKET.selections.finalGame.left.selected = BRACKET.selections.finalGame.left.options[0];   // TODO: make non-arbitrary
    }
    //
    // right
    //
    BRACKET.selections.finalGame = BRACKET.selections.finalGame || {};
    BRACKET.selections.finalGame.right = BRACKET.selections.finalGame.right || { options: [], selected: undefined, manual: false };
    BRACKET.selections.finalGame.right.options = [
      BRACKET.selections.final4.West["1"].selected,
      BRACKET.selections.final4.East["1"].selected
    ];
    if (!BRACKET.selections.finalGame.right.manual || pickNames(BRACKET.selections.finalGame.right.options).indexOf(BRACKET.selections.finalGame.right.selected.name) < 0) {
      // auto-optimize
      BRACKET.selections.finalGame.right.selected = BRACKET.selections.finalGame.right.options[0];   // TODO: make non-arbitrary
    }
    //
    // winner
    //
    BRACKET.selections.winner = BRACKET.selections.winner || { options: [], selected: undefined, manual: false };
    BRACKET.selections.winner.options = [
      BRACKET.selections.finalGame.left.selected,
      BRACKET.selections.finalGame.right.selected
    ];
    if (!BRACKET.selections.winner.manual) {
      // auto-optimize
      BRACKET.selections.winner.selected = BRACKET.selections.winner.options[0];
    }

  };


  var optionsEntry = function(round, region, spot, manual, options, selected) {
    var selectedName;
    if (selected) {
      selectedName = selected.name;
    }
    var html = '<select class="entry options' + (manual ? ' manual' : '') + '" round="' + round + '" region="' + region + '" spot="' + spot +'" >';
    options.forEach(function(option) {
      html = html + '<option value="' + option.name + '"';
      if (option.name === selectedName) {
        html = html + ' selected ';
      }
      html = html + '>' + option.name + ' (' + option.seed + ')</option>';
    });
    html = html + '</select><div class="entryOdds">' + String(BRACKET.teamOdds[selected.name][round]).substr(0,8) + '</div>';
    return html;
  };


  var render = function() {
    console.log("render called");
    ["sweet16", "elite8", "final4"].forEach(function(roundName) {
      var round = BRACKET.selections[roundName];
      if (!round) {
        return;
      }
      ["Midwest", "South", "West", "East"].forEach(function(regionName) {
        var region = round[regionName];
        var el;
        var spot;
        var entry;
        for (var spotName in region) {
          spot = region[spotName];
          el = $("." + roundName + " ." + regionName + " .spot" + spotName);
          entry = optionsEntry(roundName, regionName, spotName, spot.manual, spot.options, spot.selected);
          el.html(entry);
        }
      });
    });

    //
    // finalGame
    //
    var entry;
    var el;


    if (BRACKET.selections.finalGame) {
      //
      //  finalGame left
      //
      el = $(".bracketLeft .finalGame .spot1");
      var left = BRACKET.selections.finalGame.left;
      entry = optionsEntry("finalGame", undefined, undefined, left.manual, left.options, left.selected);
      el.html(entry);
      //
      //  finalGame right
      // 
      el = $(".bracketRight .finalGame .spot1");
      var right = BRACKET.selections.finalGame.right;
      entry = optionsEntry("finalGame", undefined, undefined, right.manual, right.options, right.selected);
      el.html(entry);
    }

    if (BRACKET.selections.winner) {
      // winner
      el = $(".winner li");
      var winner = BRACKET.selections.winner;
      entry = optionsEntry("winner", undefined, undefined, winner.manual, winner.options, winner.selected);
      el.html(entry);
    }

    bindEvents();

  };

  var bindEvents = function() {
    console.log('bindEvents called');
    $("select.entry").change(function(evt) {
      var teamName = $(this).val();
      var team = {
        name: teamName,
        seed: BRACKET.teamOdds[teamName].seed
      };
      var round = this.attributes.round.value;
      var region = this.attributes.region.value;
      var spot = this.attributes.spot.value;
      if (region && region !== "undefined") {
        if (spot && spot !== "undefined") {
          BRACKET.selections[round][region][spot].selected = team;
          BRACKET.selections[round][region][spot].manual = true;
        } else {
          BRACKET.selections[round][region].selected = team;
          BRACKET.selections[round][region].manual = true;
        }
      } else {
        if (round === "finalGame") {
          var side = $(this).parent()[0].attributes.side.value;
          BRACKET.selections[round][side].selected = team;
          BRACKET.selections[round][side].manual = true;
        } else {
          BRACKET.selections[round].selected = team;
          BRACKET.selections[round].manual = true;
        }
      }
      initOptions();
      render();
    });
  };

  var ready = function() {
    var region;
    var selections = {};
    // TODO: check local storage
    initOptions();
    render();
  };

  $(ready);

})(BRACKET);