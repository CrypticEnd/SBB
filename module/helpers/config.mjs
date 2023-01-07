export const SBB = {};

// System defaults
SBB.settings= {
    hpFortMod:     5,
    strainWillMod: 2,
    // if 1 it will give a -1 per strain
    strainPenaltyMod : 0.5,

    skillRank: {
        max: 10,
        min: 0
    },

    attributesRanks: {
        max: 10,
        min: 1
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
    body: "",
    control: "",
    intelligence: "",
    presence: "",
    technique: "",
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