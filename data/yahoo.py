
from BeautifulSoup import BeautifulSoup
import json
import urllib

urls = {
  "winner": "http://tournament.fantasysports.yahoo.com/t1/group/all/pickdistribution?round=6",
  "finalGame": "http://tournament.fantasysports.yahoo.com/t1/group/all/pickdistribution?round=5",
  "final4": "http://tournament.fantasysports.yahoo.com/t1/group/all/pickdistribution?round=4",
  "elite8": "http://tournament.fantasysports.yahoo.com/t1/group/all/pickdistribution?round=3",
  "sweet16": "http://tournament.fantasysports.yahoo.com/t1/group/all/pickdistribution?round=2"
}



results = {}

for round, url in urls.items():
    f = urllib.urlopen(url)
    html = f.read()
    f.close()
    parsedHtml = BeautifulSoup(html)
    gameTable = parsedHtml.body.find('table', attrs={'class':'game-table'})
    rows = gameTable.findAll("tr")[1:]
    for row in rows:
        team = str(row.find("a").text)
        if team == "NC A&T;/Liberty":
            team = "NC A&T/Liberty"
        pop = float(str(row.find("em").text)) / 100.0
        if not results.has_key(team):
            results[team] = {}
        results[team][round] = pop

print results

f = open("yahoo.json", 'w')
f.write(json.dumps(results))
f.close()

