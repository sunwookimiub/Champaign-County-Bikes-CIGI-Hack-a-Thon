# Routing Service for Hackathon: #

## Server address ##
http://141.142.168.53:5000/

## How to use? ##
http://141.142.168.53:5000/viaroute?loc=lat1,lon1&loc=lat2,lon2&instructions=true

*Multiple via points are allowed.*

*More details about query parameters can be found here, https://github.com/Project-OSRM/osrm-backend/wiki/Server-api*

## How to interprete response? ##
Detals can be found here, https://github.com/Project-OSRM/osrm-backend/wiki/Server-api, Response section 

## Where is it installed? ##
`/opt/sw/osrm-backend/`

## Where is OSM data stored? ##
`/opt/sw/osrm-backend/data/`

## What are the main binaries? ##
`/opt/sw/osrm-backend/build/`
`- osrm-prepare`
`- osrm-extract`
`- osrm-routed`

## How to prepare data and start service? ##
Step 1. Download OSM data from http://download.geofabrik.de or other OSM data provider, pbf and osm format are preferred

Step 2. Configure routing profiles which determines what can be routed along. In this study, we use bicycle.lua as the routing profile. Then make symbolic link with the following command
`ln -s ../profiles/bicycle.lua profile.lua`

`ln -s ../profiles/lib/`
	
Step 3. Run osrm-extract and osrm-prepare binaries to prepare addtional files for routing.
`./osrm-extract map.osm`

`./osrm-prepare map.osrm`
	
*depending on the data size, this two steps might take up to hours*

Step 4. Start the routing service with the following command,
`./osrm-routed map.osrm`

*When the routing VM gets restarted, only step 4 is needed to start the routing service.*

*Details can be found at https://github.com/Project-OSRM/osrm-backend/wiki/Running-OSRM.*