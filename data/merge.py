
import json

f_odds = open("odds.json")
odds = json.loads(f_odds.read())
f_odds.close()

f_regions = open("regions.json")
regions = json.loads(f_regions.read())
f_regions.close()

missed = 0
data = {}
for region, seeds in regions.items():
    for seed, team in seeds.items():
        data[team] = { "region": region, "seed": int(seed), "name": team }
        if team in odds:
            data[team]["odds"] = odds[team]
        else:
            data[team]["odds"] = None
            missed = missed + 1
            print team + " ???? "
            for odd in odds.keys():
                if odd[0:3] == team[0:3]:
                    print "  -- maybe: " + odd
            if (int(seed)) < 17:
                print "WARNING - team " + team + " seeded " + seed + " has no odds" 
                #raise Exception("Team seeded < 13 has no odds")

print "missing odds for: " + str(missed)

f = open("bracket.json", 'w')
f.write(json.dumps(data))
f.close()

sortedTeamNames = sorted(data, key=lambda key: data[key]["odds"], reverse=True)
sortedTeams = []
for teamName in sortedTeamNames:
    val = data[teamName]
    val["team"] = teamName
    sortedTeams.append(val)

f = open("merge_teams.json", 'w')
f.write(json.dumps(sortedTeams))
f.close()
