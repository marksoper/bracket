
from BeautifulSoup import BeautifulSoup
import json

f = open("espn.html")
html = f.read()
f.close()

parsedHtml = BeautifulSoup(html)

regions = parsedHtml.body.findAll('div', attrs={'class':'region'})

data = {}

for region in regions:
    regionName = str(region.find('b').text).split(" (")[0]
    teams = region.findAll("div", attrs={"class":"team"})
    data[regionName] = {}
    for team in teams:
        seed = int(team.find("span").text)
        name = str(team.find("a").text)
        if name.endswith(" St"):
            name = name + "ate"
        data[regionName][seed] = name


for reg in data:
    if len(data[reg]) != 16:
        raise Exception("Error with # of teams in region: " + reg)

print data

f = open("regions.json", 'w')
f.write(json.dumps(data))
f.close()