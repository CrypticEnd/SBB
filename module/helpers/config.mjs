export const SBB = {};

// System defaults
SBB.settings= {
    hpFortMod:     5,
    hpBase: 5,
    strainBase: 8,
    strainBufferWillMod: 1,
    // if 1 it will give a -1 per strain
    strainPenaltyMod : 0.5,

    speedBase : 0,
    speedMoveMod: 1,

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
    brawling:        "SBB.WeaponSkills.brawling",
    melee_primitive: "SBB.WeaponSkills.melee_primitive",
    melee_advanced:  "SBB.WeaponSkills.melee_advanced",
    archery:         "SBB.WeaponSkills.archery",
    light:           "SBB.WeaponSkills.light",
    heavy:           "SBB.WeaponSkills.heavy",
    explosive:       "SBB.WeaponSkills.explosive",
    gunnery:         "SBB.WeaponSkills.gunnery"
}

SBB.activeEffectValues = {
    "system.attributes.body.rank":         "SBB.activeEffects.charAttributeBody",
    "system.attributes.control.rank":      "SBB.activeEffects.charAttributeControl",
    "system.attributes.intelligence.rank": "SBB.activeEffects.charAttributeIntelligence",
    "system.attributes.presence.rank":     "SBB.activeEffects.charAttributePresence",
    "system.attributes.technique.rank":    "SBB.activeEffects.charAttributeTechnique",
    "system.attributes.fortitude.rank":    "SBB.activeEffects.charAttributeFortitude",
    "system.attributes.reflex.rank":       "SBB.activeEffects.charAttributeReflex",
    "system.attributes.willpower.rank":    "SBB.activeEffects.charAttributeWillpower",

    "system.attributes.body.mod":         "SBB.activeEffects.SkillBonusBody",
    "system.attributes.control.mod":      "SBB.activeEffects.SkillBonusControl",
    "system.attributes.intelligence.mod": "SBB.activeEffects.SkillBonusIntelligence",
    "system.attributes.presence.mod":     "SBB.activeEffects.SkillBonusPresence",
    "system.attributes.technique.mod":    "SBB.activeEffects.SkillBonusTechnique",

    "system.speed":                "SBB.activeEffects.speed",
    "system.HP.max":               "SBB.activeEffects.hp",
    "system.strain.max":           "SBB.activeEffects.strain",
    "system.modifiers.initiative": "SBB.activeEffects.initiativeBonus"
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

SBB.vehicleTypes = {
    boat:     "SBB.vehicle.types.boat",
    plane:    "SBB.vehicle.types.plane",
    starship: "SBB.vehicle.types.starship",
    land:     "SBB.vehicle.types.land"
}

SBB.vehicleClasses = {
    fighter: "SBB.vehicle.classes.fighter",
    frigate: "SBB.vehicle.classes.frigate",
    cruiser: "SBB.vehicle.classes.cruiser",
    capital: "SBB.vehicle.classes.capital"
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
    enhancements: "SBB.tabNames.enhancements",
    injuries:    "SBB.tabNames.injuries",
    attributes:  "SBB.tabNames.attributes",
    notes:       "SBB.tabNames.notes"
}

SBB.npcNavbar = {
    skills:    "SBB.tabNames.skills",
    equipment: "SBB.tabNames.equipment",
    effects:   "SBB.effects.effects"
}

SBB.vehicleNavBar = {
    action:   "SBB.vehicle.navbar.action",
    crew:     "SBB.vehicle.navbar.crew",
    fittings: "SBB.vehicle.navbar.fittings",
    defenses: "SBB.vehicle.navbar.defenses",
    weaponry: "SBB.vehicle.navbar.weaponry",
    log:"Log"
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