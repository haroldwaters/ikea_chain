/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function installed(part){
    console.log(Object.keys(part));
    return Object.keys(part).includes("installedIn");
}
'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * MakeFurniture
 * @param {gov.sweden.ikea.MakeFurniture} transaction
 * @transaction
 */
async function MakeFurniture(tx) {

    console.log('Making furniture!');

    let partsRegistry = await getAssetRegistry('gov.sweden.ikea.Parts');
    let wood = await partsRegistry.get(tx.wood.partsId);
    let screws = await partsRegistry.get(tx.screws.partsId);

    console.log([wood, screws])

    if(tx.wood.type === 'WOOD' && tx.screws.type === 'SCREWS' && 
       wood.installed === false   && screws.installed === false){
        let furniture = getFactory().newResource('gov.sweden.ikea', 'Furniture', tx.furnitureId);


        furniture.owner = tx.store;
        furniture.name = tx.name;
        furniture.cost = tx.wood.value + tx.screws.value;
        furniture.wood = tx.wood;
        furniture.screws = tx.screws;

        let furnitureRegistry = await getAssetRegistry('gov.sweden.ikea.Furniture')
        furnitureRegistry.add(furniture);
        
        let partsRegistry = await getAssetRegistry('gov.sweden.ikea.Parts')

        tx.wood.installed = true;
        tx.screws.installed = true;
        await partsRegistry.update(tx.wood);
        await partsRegistry.update(tx.screws);
    }
    else{
        throw "FELAKTIGA DELAR!!!";
    }
}