const express = require('express');
const pug = require('pug');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'static', 'views', 'pages'));

app.get('/', (req, res)=>{
    res.render('index')
})

class SpaceStation{
    constructor(number, capacity, need) {
        this.number =number;
        this.capacity = capacity;
        this.need=need;
    }
}
class Planet{
    constructor(name, capacity,mass) {
        this.name=name;
        this.capacity = capacity;
        this.mass=mass;
    }
}
class SpaceStationOnOrbit{
    constructor(SpaceStation,Planet) {
        this.SpaceStation = SpaceStation;
        this.Planet = Planet;
    }
}
class Shipment
{
    constructor(code,name, weight) {
        this.code = code;
        this.name = name;
        this.weight = weight;
    }
}
class ShipmentFinishedOnSpaceStation
{
    constructor(SpaceStation,Shipment) {
        this.SpaceStation = SpaceStation;
        this.Shipment = Shipment;
    }
}
class ShipmentFinishedOnPlanet
{
    constructor(Planet,Shipment) {
        this.Planet = Planet;
        this.Shipment = Shipment;
    }
}
let Planets = [new Planet('Mercury',3,12),
               new Planet('Venus',5,23),
               new Planet('Earth',8,34),
               new Planet('Mars',9,37)]
let SpaceStations = [new SpaceStation(11,4,1),new SpaceStation(12,3,1),
                    new SpaceStation(21,5,2),
                    new SpaceStation(31,7,1),new SpaceStation(32,9,1),
                    new SpaceStation(41,10,2)]
let SpaceStationsOnOrbit = []
let Shipments = [new Shipment(111,'Toothpaste',50),
new Shipment(222,'Equipment',64),
new Shipment(333,'Books',78),
new Shipment(444,'Food',112)]

let ShipmentsFinishedOnSpaceStation = []
let ShipmentsFinishedOnPlanet = []
let ShipmentsTransferedOnSpaceStation = []
let ShipmentsTransferedOnPlanet = []

app.get('/SpaceStations', (req, res)=>{
    res.render('SpaceStations', {data: SpaceStations})
})
app.get('/Planets', (req, res)=>{
    res.render('Planets', {data: Planets})
})
app.get('/Shipments', (req, res)=>{
    res.render('Shipments', {data: Shipments})
})
app.get('/ShipmentsToSpaceStation', (req, res)=>{
  res.render('ShipmentsToSpaceStation', {Shipment: Shipments, SpaceStation:SpaceStations, ShipmentFinished: ShipmentsFinishedOnSpaceStation})
})
app.get('/ShipmentsToPlanet', (req, res)=>{
  res.render('ShipmentsToPlanet', {Shipment: Shipments,Planet:Planets, ShipmentFinished: ShipmentsFinishedOnPlanet})
})
app.get('/ShipmentsFromStationToStation', (req, res)=>{
  res.render('ShipmentsFromStationToStation', {ShipmentFinishedOnSpaceStation: ShipmentsFinishedOnSpaceStation,SpaceStation:SpaceStations,
  ShipmentFinished: ShipmentsTransferedOnSpaceStation})
})
app.get('/ShipmentsFromPlanetToStation', (req, res)=>{
  res.render('ShipmentsFromPlanetToStation', {ShipmentFinishedOnPlanet: ShipmentsFinishedOnPlanet,SpaceStation:SpaceStations,
    ShipmentFinished:ShipmentsTransferedOnPlanet})
})
app.get('/Summary', (req, res)=>{
        res.render('Summary', {SpaceStations:SpaceStations.filter(value=>{
        let c=0;
        ShipmentsFinishedOnSpaceStation.forEach(value1=>{
            if(value1.SpaceStation === value) c++;
            })
        return value.need>=c/0.3;
        })
    })
})


app.post('/createSpaceStation', (req, res)=>{
    let body = req.body;
    console.log(body);
    console.log(body.number);
    let check = SpaceStations.some(value => value.number === +body.number)
    let newSpaceStation = new SpaceStation(+body.number, +body.capacity, +body.need)
    if(check) res.redirect('/SpaceStations')
    else {
        SpaceStations.push(newSpaceStation)
        res.redirect('/SpaceStations')}
});
app.post('/editSpaceStation', (req, res)=>{
    let body = req.body;
    let index = body.index[0];
    let check = SpaceStations.some(value => value.number === +body.number)

    console.log(index);
    if(check) res.redirect('/SpaceStations')
    else {
        if(body.number!='') SpaceStations[index].number=+body.number
        if(body.capacity!='') SpaceStations[index].capacity = +body.capacity
        if(body.need!='') SpaceStations[index].need = +body.need
        res.redirect('/SpaceStations')}
});
app.post('/deleteSpaceStation', (req, res)=>{
    let body = req.body;
    let index = body.index[0];

    SpaceStations.splice(index, 1)
    res.redirect('/SpaceStations')
});
app.post('/findSpaceStation', (req, res)=>{
    let body = req.body;
    let SpaceStation
    let check = SpaceStations.some(value => {
        if(value.number === +body.number) SpaceStation = value
        return value.number === +body.number
    })
    if(check) {
        res.render('SpaceStations', {info: SpaceStation, data: SpaceStations})
    } else res.redirect('/SpaceStations')
});


app.post('/createPlanet', (req, res)=>{
    let body = req.body;
    let check = Planets.some(value => value.name === body.name)
    let newPlanet = new Planet(body.name, +body.capacity, +body.mass)
    console.log(body, );

    if(check) res.redirect('/Planets');
    else {
        Planets.push(newPlanet)
        res.redirect('/Planets');
    }

});
app.post('/editPlanet', (req, res)=>{
    let body = req.body;
    let index = body.index[0];
    let check = Planets.some(value => value.name === body.name)
    if(!check) {
        if(body.name!='') Planets[index].name = body.name
        if(body.capacity!='') Planets[index].capacity = +body.capacity
        if(body.mass!='') Planets[index].mass = +body.mass
    }
    res.redirect('/Planets');
});
app.post('/deletePlanet', (req, res)=>{
    let body = req.body;
    let index = body.index[0];

    Planets.splice(index, 1)
    res.redirect('/Planets')
});
app.post('/findPlanet', (req, res)=>{
    let body = req.body;
    let Planet
    console.log(body);
    let check = Planets.some(value => {
        if(value.name === body.name) Planet = value
        return value.name === body.name
    })
    console.log(check);

    if(check) {
        res.render('Planets', {info: Planet, data: Planets})
    } else res.redirect('/Planets')
});

app.post('/createShipment', (req, res)=>{
    let body = req.body;
    let check = Shipments.some(value => value.code === +body.code)
    let newShipment = new Shipment(+body.code, body.name, +body.weight)
    console.log(body, );
    if(check) res.redirect('/Shipments');
    else {
        Shipments.push(newShipment)
        res.redirect('/Shipments');
    }
});
app.post('/editShipment', (req, res)=>{
    let body = req.body;
    let index = body.index[0];
    let check = Shipments.some(value => value.code === +body.code)
    if(!check) {
        if(body.code!='') Shipments[index].code = +body.code
        if(body.name!='') Shipments[index].name = body.name
        if(body.weight!='') Shipments[index].weight = +body.weight
    }
    res.redirect('/Shipments');
});
app.post('/deleteShipment', (req, res)=>{
    let body = req.body;
    let index = body.index[0];

    Shipments.splice(index, 1)
    res.redirect('/Shipments')
});
app.post('/findShipment', (req, res)=>{
    let body = req.body;
    let Shipment
    console.log(body);
    let check = Shipments.some(value => {
        if(value.code === +body.code) Shipment = value
        return value.code === +body.code
    })
    console.log(check);
    if(check) {
        res.render('Shipments', {info: Shipment, data: Shipments})
    } else res.redirect('/Shipments')
});

app.post('/ShipmentToSpaceStationDelivery', (req,res)=>{
    let body=req.body;
    console.log(body);
    let Shipment = body.Shipment[0];
    let SpaceStation = body.SpaceStation[0];
    let ShipmentOnSpaceStation = new ShipmentFinishedOnSpaceStation(SpaceStations[SpaceStation], Shipments[Shipment]);
    let check1 = ShipmentsFinishedOnSpaceStation.some(value => value.Shipment.code === +ShipmentOnSpaceStation.Shipment.code)
    let check2 = ShipmentsFinishedOnPlanet.some(value => value.Shipment.code === +ShipmentOnSpaceStation.Shipment.code)
    if(check1+check2)  res.redirect('/ShipmentsToSpaceStation')
    else
    {
        SpaceStations.forEach(value=>{
            if(value.number === +ShipmentOnSpaceStation.SpaceStation.number)
            {
                let c=0;
                ShipmentsFinishedOnSpaceStation.forEach(value1=>{
                    if(value1.SpaceStation === SpaceStations[SpaceStation]) c++;
                })
                if(c>=value.need) res.redirect('/ShipmentsToSpaceStation')
                else 
                {
                    ShipmentsFinishedOnSpaceStation.push(ShipmentOnSpaceStation);
                    res.render('ShipmentsToSpaceStation',{Shipment: Shipments, SpaceStation: SpaceStations, ShipmentFinished: ShipmentsFinishedOnSpaceStation})
                }
            }
        })
    }
});
app.post('/ShipmentToPlanetDelivery', (req,res)=>{
    let body=req.body;
    console.log(body);
    let Shipment = body.Shipment[0];
    let Planet = body.Planet[0];
    let ShipmentOnPlanet = new ShipmentFinishedOnPlanet(Planets[Planet], Shipments[Shipment]);
    let check1 = ShipmentsFinishedOnSpaceStation.some(value => value.Shipment.code === +ShipmentOnPlanet.Shipment.code)
    let check2 = ShipmentsFinishedOnPlanet.some(value => value.Shipment.code === +ShipmentOnPlanet.Shipment.code)
    if(check1+check2)  res.redirect('/ShipmentsToPlanet')
    else
    {
        Planets.forEach(value=>{
            if(value.name === ShipmentOnPlanet.Planet.name)
            {
                let c=0;
                ShipmentsFinishedOnPlanet.forEach(value1=>{
                    if(value1.Planet === Planets[Planet]) c++;
                })
                if(c>=value.capacity) res.redirect('/ShipmentsToPlanet')
                else 
                {
                    ShipmentsFinishedOnPlanet.push(ShipmentOnPlanet);
                    console.log(ShipmentsFinishedOnPlanet);
                    res.render('ShipmentsToPlanet',{Shipment: Shipments, Planet: Planets, ShipmentFinished: ShipmentsFinishedOnPlanet})
                }
            }
        })
    }
});
app.post('/ShipmentFromStationToStationTransfer', (req,res)=>{
    let body=req.body;
    console.log(body);
    let SpaceStation = body.SpaceStation[0];
    let i = body.ShipmentFinishedOnSpaceStation.indexOf('Code:')+5;
    let j = 0;
    let k=i;
    while(body.ShipmentFinishedOnSpaceStation[i]!=","){
        j++;
        i++;
    }
    let ShipmentCode =+body.ShipmentFinishedOnSpaceStation.substr(k,j);
    let Codeonpl;
    let Codeonsp;
    Shipments.forEach(value =>{
        if(value.code===ShipmentCode)
            Codeonpl=Shipments.indexOf(value);
    });
    ShipmentsFinishedOnSpaceStation.forEach(value =>{
        if(value.code===ShipmentCode)
            Codeonsp=value.SpaceStation.number;
    });
    const Shipment = Shipments[Codeonpl];
    const ShipmentOnNewSpaceStation = new ShipmentFinishedOnSpaceStation(SpaceStations[SpaceStation], Shipments[Codeonpl]);
    if(ShipmentOnNewSpaceStation.SpaceStation.number === Codeonsp) res.redirect('/ShipmentsFromStationToStation')
    else
    SpaceStations.forEach(value=>{
        if(value.number === +ShipmentOnNewSpaceStation.SpaceStation.number)
        {
            let c=0;
            ShipmentsFinishedOnSpaceStation.forEach(value1=>{
                if(value1.SpaceStation === SpaceStations[SpaceStation]) c++;
            })
            if(c>=value.need) res.redirect('/ShipmentsFromStationToStation')
            else
            {
                ShipmentsFinishedOnSpaceStation.forEach(value2=>{
                    if(value2.Shipment.code === +ShipmentOnNewSpaceStation.Shipment.code) value2.SpaceStation=ShipmentOnNewSpaceStation.SpaceStation
                })
                ShipmentsTransferedOnSpaceStation.push(ShipmentOnNewSpaceStation);
                res.render('ShipmentsFromStationToStation', {ShipmentFinishedOnSpaceStation: ShipmentsFinishedOnSpaceStation,SpaceStation:SpaceStations,
                ShipmentFinished: ShipmentsTransferedOnSpaceStation})
            }
        }
    })
});
app.post('/ShipmentFromPlanetToStationTransfer', (req,res)=>{
    let body=req.body;
    console.log(body);
    let SpaceStation = body.SpaceStation[0];
    let i = body.ShipmentFinishedOnPlanet.indexOf('Code:')+5;
    let j = 0;
    let k = i;
    while(body.ShipmentFinishedOnPlanet[i]!=","){
        j++;
        i++;
    }
    let ShipmentCode =+body.ShipmentFinishedOnPlanet.substr(k,j);
    let Codeonpl;
    Shipments.forEach(value =>{
        if(value.code===ShipmentCode)
            Codeonpl=Shipments.indexOf(value);
    });
    const Shipment = Shipments[Codeonpl];
    const ShipmentOnNewSpaceStation = new ShipmentFinishedOnSpaceStation(SpaceStations[SpaceStation], Shipments[Codeonpl]);
    SpaceStations.forEach(value=>{
        if(value.number === +ShipmentOnNewSpaceStation.SpaceStation.number)
        {
            let c=0;
            ShipmentsFinishedOnSpaceStation.forEach(value1=>{
                if(value1.SpaceStation === SpaceStations[SpaceStation]) c++;
            })
            if(c>=value.need) res.redirect('/ShipmentsFromPlanetToStation')
            else
            {
                ShipmentsFinishedOnPlanet.forEach(value2=>{
                    if(value2.Shipment ===  Shipment)
                    {
                        ShipmentsFinishedOnPlanet.splice(ShipmentsFinishedOnPlanet.indexOf(value2),1);
                    }
                })
                ShipmentsFinishedOnSpaceStation.push(ShipmentOnNewSpaceStation);
                ShipmentsTransferedOnPlanet.push(ShipmentOnNewSpaceStation);
                res.render('ShipmentsFromPlanetToStation', {ShipmentFinishedOnPlanet: ShipmentsFinishedOnPlanet, SpaceStation:SpaceStations,
                ShipmentFinished: ShipmentsTransferedOnPlanet})
            }
        }
    })
});
app.listen(8080, () => {
    console.log(8080)
});
