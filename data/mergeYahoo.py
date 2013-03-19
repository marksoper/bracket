
import json

ft = open("teams.json")
teams = json.loads(ft.read())
ft.close()

fy = open("yahoo.json")
yahoo = json.loads(fy.read())
fy.close()

for team in teams:
  if not yahoo.has_key(team["team"]):
    print "missing: " + team["team"]