export const SBB = {};

// System defaults
SBB.settings= {
    hpFortMod:     5,
    hpBase: 5,
    strainBase: 8,
    strainBufferWillMod: 1,
    // if 1 it will give a -1 per strain
    strainPenaltyMod : 0.5,

    skillRank: {
        max: 10,
        min: 0
    },

    attributesRanks: {
        max: 10,
        min: 1
    },

    focusBonus: 2,
    tenetBonus: 10,

    defaultArmourValues: {
        kinetic:   0,
        energy:    0,
        explosive: 0,
        tl: 0
    }
}

SBB.weaponSkills = {
    none:            "",
    melee_primitive: "SBB.WeaponSkills.melee_primitive",
    melee_advanced:  "SBB.WeaponSkills.melee_advanced",
    archery:         "SBB.WeaponSkills.archery",
    light:           "SBB.WeaponSkills.light",
    heavy:           "SBB.WeaponSkills.heavy",
    explosive:       "SBB.WeaponSkills.explosive"
}

// This is ordered!
SBB.weaponHeaders= {
    linkedSkill:   "SBB.weaponHeaders.linkedSkill",
    damageType:    "SBB.weaponHeaders.damageType",
    damage:        "SBB.weaponHeaders.damage",
    harmRange:     "SBB.weaponHeaders.harmRange",
    magazine:      "SBB.weaponHeaders.magazine",
    rof:           "SBB.weaponHeaders.rof",
    handsRequired: "SBB.weaponHeaders.handsRequired",
    weight:        "SBB.weaponHeaders.weight",
    techLevel:     "SBB.weaponHeaders.techLevel"
}

SBB.armourHeaders= {
    armourType: "SBB.armour.armourType",
    kinetic:    "SBB.damageTypes.kinetic",
    energy:     "SBB.damageTypes.energy",
    explosive:  "SBB.damageTypes.explosive",
    weight:  "SBB.armour.weight",
    techLevel:  "SBB.armour.techLevel"
}

SBB.armourTypes= {
    none: "",
    head: "SBB.armour.head",
    body: "SBB.armour.body"
}

SBB.damageTypes = {
    kinetic:   "SBB.damageTypes.kinetic",
    energy:    "SBB.damageTypes.energy",
    explosive: "SBB.damageTypes.explosive",
}

SBB.rangeHeaders = {
    1: "SBB.rangeHeaders.1",
    2:   "SBB.rangeHeaders.2",
    3:  "SBB.rangeHeaders.3",
    4:    "SBB.rangeHeaders.4",
    5: "SBB.rangeHeaders.5",
    6: "SBB.rangeHeaders.6",
    7: "SBB.rangeHeaders.7",
    8: "SBB.rangeHeaders.8"
}

SBB.skillTypes = {
    body: "SBB.attributes.body",
    control: "SBB.attributes.control",
    intelligence: "SBB.attributes.intelligence",
    presence: "SBB.attributes.presence",
    technique: "SBB.attributes.technique",
}

SBB.saveTypes = {
    fortitude: "SBB.saves.fortitude",
    reflex: "SBB.saves.reflex",
    willpower: "SBB.saves.will"
}

SBB.common = {
    skillCheck: "SBB.common.skillCheck",
    skillPass: "SBB.common.passed",
    skillFail: "SBB.common.failed"
}

SBB.pcNavbar = {
    personal:    "SBB.tabNames.personal",
    skills:      "SBB.tabNames.skills",
    features:    "SBB.tabNames.features",
    equipment:   "SBB.tabNames.equipment",
    enhancement: "SBB.tabNames.enhancement",
    injuries:    "SBB.tabNames.injuries",
    attributes:  "SBB.tabNames.attributes",
    notes:       "SBB.tabNames.notes"
}

SBB.effectTypes ={
    drug: "SBB.effects.drug",
    implant: "SBB.effects.implant",
    injury:"SBB.effects.injury"
}

SBB.equipmentList ={
    weapons:{
        ammo: "SBB.equipmentList.weapons.ammo",
        ammoMax: "SBB.equipmentList.weapons.ammoMax"
    },
    consumables:{
        quantity: "SBB.equipmentList.consumables.quantity",
        weight: "SBB.equipmentList.consumables.weight",
    },
    armour:{
        equipped: "SBB.equipmentList.armour.equipped",
        weight: "SBB.equipmentList.armour.weight"
    },
    item:{
        quantity: "SBB.equipmentList.item.quantity",
        weight: "SBB.equipmentList.item.weight"
    }
}