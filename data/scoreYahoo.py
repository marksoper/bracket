
import json

ft = open("teams.json")
teams = json.loads(ft.read())
ft.close()

for team in teams:
  if team['odds'] == None:
    team["ratio"] = 0
    continue
  if team['popularity']['winner'] == None or team['popularity']['winner'] == 0:
    team["ratio"] = 0
    continue
  #print team["name"] + " -- " + " Winner: Vegas: " + str(team["odds"]) + " Popularity: " + str(team["popularity"]["winner"]) + " -- normalized difference: " + str((team["odds"] / team["popularity"]["winner"]) )
  #team["ratio"] = (team["odds"] - team["popularity"]["winner"]) * team["odds"]
  team["ratio"] = (team["odds"] * team["odds"]) / team["popularity"]["winner"]

sortedTeams = sorted(teams, key=lambda k: k["ratio"], reverse=True)

print "<tr><th>Team (seed)</th><th>Vegas</th><th>Yahoo</th><th>Vegas - Yahoo</th><th>Vegas / Yahoo</th></tr>" 
for team in sortedTeams:
  name = str(team["name"]) + " (" + str(team["seed"]) + ")"
  vegas = str(team["odds"])[0:6]
  yahoo = str(team["popularity"]["winner"])[0:6]
  popular = str(team["popularity"]["winner"])[0:6]
  try:
    diff = str(team["odds"] - team["popularity"]["winner"])[0:6]
    ratio = str(team["odds"] / team["popularity"]["winner"])[0:6]
  except:
    continue
  print "<tr>"
  print "<td>" + name + "</td>"
  print "<td>" + vegas + "</td>"
  print "<td>" + yahoo + "</td>"
  print "<td>" + diff + "</td>"
  print "<td>" + ratio + "</td>"
  print "</tr>"
