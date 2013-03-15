
from BeautifulSoup import BeautifulSoup
import json
import urllib


#f = open("espn.html")
f = urllib.urlopen("http://espn.go.com/mens-college-basketball/bracketology")
html = f.read()
f.close()


parsedHtml = BeautifulSoup(html)

regions = parsedHtml.body.findAll('div', attrs={'class':'region'})

data = {}

def capitalizeAll(name):
    parts = name.split(" ")
    newParts = []
    for part in parts:
        newPart = part.lower().capitalize()
        newParts.append(newPart)
    return " ".join(newParts)

for region in regions:
    regionName = str(region.find('b').text).split(" (")[0].lower().capitalize()
    teams = region.findAll("div", attrs={"class":"team"})
    data[regionName] = {}
    for team in teams:
        seed = int(team.find("span").text)
        name = str(team.find("a").text)
        if len(name) > 4 or name == "IONA":
            name = capitalizeAll(name)
        if name.endswith(" St"):
            name = name + "ate"
        if name == "Miami (fl)":
            name = "Miami (FL)"
        data[regionName][seed] = name


for reg in data:
    if len(data[reg]) != 16:
        raise Exception("Error with # of teams in region: " + reg)

print data

f = open("regions.json", 'w')
f.write(json.dumps(data))
f.close()
