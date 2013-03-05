

import HTMLParser
from BeautifulSoup import BeautifulSoup
import json

h = HTMLParser.HTMLParser()

f = open("odds.html")
html = f.read()
f.close()

parsedHtml = BeautifulSoup(html)
rows = parsedHtml.find("td", attrs={"class":"viBodyBorderNorm"}).find("table").findAll("tr")

data = {}

for row in rows[1:]:
    team = h.unescape(row.findAll("td")[0].text)
    if team == "Miami, FL":
        team = "Miami (FL)"
    if team.startswith("St."):
        team = team.replace("St.", "Saint")
    if team == "N.C. State":
        team = "North Carolina State"
    if team == "VCU":
        team = "Virginia Commonwealth"
    oddsParts = row.findAll("td")[1].text.split("/")
    odds = float(str(oddsParts[1])) / float(str(oddsParts[0]))
    data[team] = odds

f = open("odds.json", 'w')
f.write(json.dumps(data))
f.close()
