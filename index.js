
(function(BRACKET) {

  BRACKET.poolSize = BRACKET.poolSize || 10;

  var seedMap = {
    1: [1, 16, 8, 9],
    2: [5, 12, 4, 13],
    3: [6, 11, 3, 14],
    4: [7, 10, 2, 15]
  };

  BRACKET.scoreFunction = function(round, seed) {
    if (round === "sweet16") {
      return 4;
    } else if (round === "elite8") {
      return 8;
    } else if (round === "final4") {
      return 16;
    } else if (round === "finalGame") {
      return 32;
    } else if (round === "winner") {
      return 64;
    }
  };

  var spotMap = {
    sweet16: 4,
    elite8: 2,
    final4: 1
  };

  window.log = function(arg){
    if(this.console){
      console.log( arg );
    }
  };

  var yourScoreMap = function(yourScore) {
    return yourScore;
    var high = 190;
    var low = 125;
    var d = (high - low)/10;
    var s = (yourScore - low) / d;
    return s;
  };

  var oddsMin = function(odds) {
    return Math.min(odds, 0.98);
  };

  BRACKET.teamOdds = {};
  BRACKET.teams.forEach(function(team) {
    BRACKET.teamOdds[team.name] = {
      seed: team.seed,
      region: team.region,
      popularity: team.popularity,
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

  var bestOptionByOdds = function(options, round) {
    round = round || "winner";
    var best;
    options.forEach(function(option) {
      option.odds = BRACKET.teamOdds[option.name][round];
      best = best || option;
      if (option.odds > best.odds) {
        best = option;
      }
    });
    return best;
  };

  var pickNames = function(arrObjs) {
    var arrStrs = [];
    arrObjs.forEach(function(obj) {
      arrStrs.push(obj.name);
    });
    return arrStrs;
  };

  var initOptions = function() {

    BRACKET.yourScore = {
      games: 0,
      points: 0,
      delta: 0
    };

    BRACKET.selections = BRACKET.selections || {};

    //
    // sweet16
    //
    BRACKET.selections.sweet16 = BRACKET.selections.sweet16 || {};
    ["Midwest", "West", "South", "East"].forEach(function(regionName) {
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
          var best = bestOptionByOdds(BRACKET.selections.sweet16[regionName][spot16].options, "sweet16");
          BRACKET.selections.sweet16[regionName][spot16].selected = best;
        }
        BRACKET.yourScore.games += 1;
        BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.sweet16[regionName][spot16].selected.name].sweet16 * BRACKET.scoreFunction("sweet16", BRACKET.selections.sweet16[regionName][spot16].selected.seed);
        BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.sweet16[regionName][spot16].selected.name].sweet16 - BRACKET.teamOdds[BRACKET.selections.sweet16[regionName][spot16].selected.name].popularity.sweet16) * BRACKET.scoreFunction("sweet16", BRACKET.selections.sweet16[regionName][spot16].selected.seed);
      });
    });

    //
    // elite8
    //
    BRACKET.selections.elite8 = BRACKET.selections.elite8 || {};
    ["Midwest", "West", "South", "East"].forEach(function(regionName) {
      var best;
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
        best = bestOptionByOdds(BRACKET.selections.elite8[regionName]["1"].options, "elite8");
        BRACKET.selections.elite8[regionName]["1"].selected = best;
      }
      //
      //
      //
      BRACKET.yourScore.games += 1;
      BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["1"].selected.name].elite8 * BRACKET.scoreFunction("elite8", BRACKET.selections.elite8[regionName]["1"].selected.seed);
      BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["1"].selected.name].elite8 - BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["1"].selected.name].popularity.elite8) * BRACKET.scoreFunction("elite8", BRACKET.selections.elite8[regionName]["1"].selected.seed);
      
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
        best = bestOptionByOdds(BRACKET.selections.elite8[regionName]["2"].options, "elite8");
        BRACKET.selections.elite8[regionName]["2"].selected = best;
      }
      //
      //
      //
      BRACKET.yourScore.games += 1;
      BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["2"].selected.name].elite8 * BRACKET.scoreFunction("elite8", BRACKET.selections.elite8[regionName]["2"].selected.seed);
      BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["2"].selected.name].elite8 - BRACKET.teamOdds[BRACKET.selections.elite8[regionName]["2"].selected.name].popularity.elite8) * BRACKET.scoreFunction("elite8", BRACKET.selections.elite8[regionName]["2"].selected.seed);
    });

    //
    // final4
    //
    BRACKET.selections.final4 = BRACKET.selections.final4 || {};
    ["Midwest", "West", "South", "East"].forEach(function(regionName) {
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
        var best = bestOptionByOdds(BRACKET.selections.final4[regionName]["1"].options, "final4");
        BRACKET.selections.final4[regionName]["1"].selected = best;
      }

      BRACKET.yourScore.games += 1;
      BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.final4[regionName]["1"].selected.name].final4 * BRACKET.scoreFunction("final4", BRACKET.selections.final4[regionName]["1"].selected.seed);
      BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.final4[regionName]["1"].selected.name].final4 - BRACKET.teamOdds[BRACKET.selections.final4[regionName]["1"].selected.name].popularity.final4) * BRACKET.scoreFunction("final4", BRACKET.selections.final4[regionName]["1"].selected.seed);

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
      BRACKET.selections.final4.West["1"].selected
    ];
    if (!BRACKET.selections.finalGame.left.manual || pickNames(BRACKET.selections.finalGame.left.options).indexOf(BRACKET.selections.finalGame.left.selected.name) < 0) {
      // auto-optimize
      BRACKET.selections.finalGame.left.selected = bestOptionByOdds(BRACKET.selections.finalGame.left.options, "finalGame");
    }

    BRACKET.yourScore.games += 1;
    BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.finalGame.left.selected.name].finalGame * BRACKET.scoreFunction("finalGame", BRACKET.selections.finalGame.left.selected.seed);
    BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.finalGame.left.selected.name].finalGame - BRACKET.teamOdds[BRACKET.selections.finalGame.left.selected.name].popularity.finalGame) * BRACKET.scoreFunction("finalGame", BRACKET.selections.finalGame.left.selected.seed);

    //
    // right
    //
    BRACKET.selections.finalGame = BRACKET.selections.finalGame || {};
    BRACKET.selections.finalGame.right = BRACKET.selections.finalGame.right || { options: [], selected: undefined, manual: false };
    BRACKET.selections.finalGame.right.options = [
      BRACKET.selections.final4.South["1"].selected,
      BRACKET.selections.final4.East["1"].selected
    ];
    if (!BRACKET.selections.finalGame.right.manual || pickNames(BRACKET.selections.finalGame.right.options).indexOf(BRACKET.selections.finalGame.right.selected.name) < 0) {
      // auto-optimize
      BRACKET.selections.finalGame.right.selected = bestOptionByOdds(BRACKET.selections.finalGame.right.options, "finalGame");
    }
    BRACKET.yourScore.games += 1;
    BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.finalGame.right.selected.name].finalGame * BRACKET.scoreFunction("finalGame", BRACKET.selections.finalGame.right.selected.seed);
    BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.finalGame.right.selected.name].finalGame - BRACKET.teamOdds[BRACKET.selections.finalGame.right.selected.name].popularity.finalGame) * BRACKET.scoreFunction("finalGame", BRACKET.selections.finalGame.right.selected.seed);

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
      BRACKET.selections.winner.selected = bestOptionByOdds(BRACKET.selections.winner.options, "winner");
      BRACKET.selections.winner.selected = BRACKET.selections.winner.options[0];
    }
    BRACKET.yourScore.games += 1;
    BRACKET.yourScore.points += BRACKET.teamOdds[BRACKET.selections.winner.selected.name].winner * BRACKET.scoreFunction("winner", BRACKET.selections.winner.selected.seed);
    BRACKET.yourScore.delta += (BRACKET.teamOdds[BRACKET.selections.winner.selected.name].winner - BRACKET.teamOdds[BRACKET.selections.winner.selected.name].popularity.winner) * BRACKET.scoreFunction("winner", BRACKET.selections.winner.selected.seed);


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
    html = html + '</select><div class="entryOdds">' + String(BRACKET.scoreFunction(round, selected.seed) * BRACKET.teamOdds[selected.name][round]).substr(0,5) + '</div>';
    html = html + '</select><div class="entryDelta">' + String(BRACKET.scoreFunction(round, selected.seed) * (BRACKET.teamOdds[selected.name][round] - BRACKET.teamOdds[selected.name].popularity[round])).substr(0,5) + '</div>';
    return html;
  };


  var render = function() {
    ["sweet16", "elite8", "final4"].forEach(function(roundName) {
      var round = BRACKET.selections[roundName];
      if (!round) {
        return;
      }
      ["Midwest", "West", "South", "East"].forEach(function(regionName) {
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

    //
    // yourScore
    //
    $(".yourScore").html(String(yourScoreMap(BRACKET.yourScore.points)).substr(0,6));
    $(".yourDelta").html(String(BRACKET.yourScore.delta).substr(0,6));



    bindEvents();

  };

  var track = function(event, props) {
    if (window.mixpanel) {
      window.mixpanel.track(event, props);
    } else {
      log("EVENT: " + event + " WITH PROPERTIES: " + JSON.stringify(props));
    }
  };

  var bindEvents = function() {
    $("select.entry").change(function(evt) {
      var teamName = $(this).val();
      var team = {
        name: teamName,
        seed: BRACKET.teamOdds[teamName].seed
      };
      var round = this.attributes.round.value;
      var region = this.attributes.region.value;
      var spot = this.attributes.spot.value;
      beforePoints = BRACKET.yourScore.points;
      beforeDelta = BRACKET.yourScore.delta;
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
      track("selection", {
        round: round,
        region: region,
        spot: spot,
        team: team.name,
        seed: team.seed,
        teamOdds: BRACKET.teamOdds[team.name][round],
        teamPopularity: BRACKET.teamOdds[team.name].popularity[round],
        beforePoints: beforePoints,
        beforeDelta: beforeDelta,
        afterPoints: BRACKET.yourScore.points,
        afterDelta: BRACKET.yourScore.delta
      });
    });
  };

  var ready = function() {
    // TODO: check local storage
    initOptions();
    render();
    track("ready");
  };

  $(ready);

})(BRACKET);